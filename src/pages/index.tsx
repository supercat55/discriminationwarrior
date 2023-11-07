import React, { useEffect, useRef, useState } from "react";
import { Input, BackTop, List, Card, Select, Spin } from 'antd';
import {
  queryConnectionZipCodeState,
  queryInterestCountryByZipCode,
  queryRejectionCountryByZipCode,
  queryInterestStateByState
} from "@/services";
import useLocalStorage from './useLocal';
import useQuery from './useQuery';
import cls from '@/pages/index.less';


enum Type {
  Interest,
  Rejection
}

const RankPage = () => {
  const connectionZipCodeStateRef = useRef<Rule[]>([]);
  const { getConnection, setConnection } = useLocalStorage();

  const [zipCode, setZipCode] = useState<string>();
  const [data, setData] = useState<Option[]>([]);
  const [type, setType] = useState(Type.Interest);

  const { query, loading } = useQuery();

  const showEmptyError = zipCode !== undefined && (zipCode.length < 5 || isNaN(Number(zipCode)));

  useEffect(() => {
    init()
    if (zipCode) {
      onSearch(zipCode || '');
    }
  }, [type]);

  const init = async () => {
    const cache = getConnection();

    if (cache && Array.isArray(cache)) {
      connectionZipCodeStateRef.current = cache;

      return;
    }

    const result: Rule[] = await query(() => queryConnectionZipCodeState())
    setConnection(result);
  }

  const convertSort = (list: any[]) => {
    return list.sort((a: any, b: any) => {
      return Number(b.Coefficient) - Number(a.Coefficient)
    });
  }

  const searchInterest = async (code: string) => {
    const result: Option[] = await query(() => queryInterestCountryByZipCode(code),
      (error: any) => {
        if (error?.response?.status === 404) {
          const matchState = connectionZipCodeStateRef.current?.find(o => o.Zipcode === code)?.State;

          searchState(matchState)
        }
      })
    setData(result);
  }

  const searchRejection = async (code: string) => {
    const result: Option[] = await query(() => queryRejectionCountryByZipCode(code));

    setData(result);
  }

  const searchState = async (stateCode?: string) => {
    if (!stateCode) {
      setData([]);
      return;
    }

    const result: Option[] = await query(() => queryInterestStateByState(stateCode));

    setData(result);
  }


  const onSearch = async (v: string) => {
    if (showEmptyError) return;

    if (!v) {
      setZipCode('');
    }

    switch (type) {
      case Type.Interest:
        searchInterest(v);
        break;
      case Type.Rejection:
        searchRejection(v);
      default:
        break;
    }
  }



  return (
    <Spin spinning={loading}>
      <BackTop />
      <div className="center-wrap">
        <div className={cls.header}>
          <h1 className={cls.title}>
            Compare the degree of discrimination
          </h1>
          <h1>
            in
            <div className={cls.condition}>
              <Select
                value={type}
                options={[
                  {
                    label: 'interest',
                    value: Type.Interest
                  },
                  {
                    label: 'rejection',
                    value: Type.Rejection
                  }
                ]}
                onChange={setType}
              />
            </div>
            rates in
            <div className={`${cls.condition} ${showEmptyError ? cls.error : ''}`}>
              <Input.Search
                maxLength={5}
                inputMode="numeric"
                placeholder="10001"
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
                onSearch={onSearch}
              />
              {showEmptyError ? <span className={cls.tip}>Enter U.S. ZIP code</span> : null}
            </div>
          </h1>
        </div>

      </div>
      <div className={cls.divider} />

      <div className="center-wrap">
        <List
          header={(
            <h2>Here are {data.length} options for you</h2>
          )}
          dataSource={convertSort(data)}
          className={cls.item}
          renderItem={(item) => {
            return (
              <Card key={item.arid} style={{ marginBottom: 20 }}>
                <div className={cls.card}>
                  <div className={cls.col}>
                    <div className={cls.label}>Coefficient</div>
                    <div className={cls.value}>{item.Coefficient}</div>
                  </div>
                  <div className={cls.col}>
                    <div className={cls.label}>Standard error</div>
                    <div className={cls.value}>{item["T-Value"]}</div>
                  </div>
                  <div className={cls.col2}>
                    <div className={cls.label}>Significance</div>
                    <div className={cls.value}>{item.Significance}</div>
                  </div>
                  <div className={cls.col}>
                    <div className={cls.label}>
                      {item.Zipcode ? 'Zip-Code' : 'State'}
                    </div>
                    <div className={cls.value}>{item.Zipcode || item.State}</div>
                  </div>
                  <div className={cls.right}>
                    <span className={cls.bank}>{item.Bank_Name}</span>
                    {item.County ? <span>county: {item.County}</span> : null}
                  </div>

                </div>
              </Card>
            )
          }}
        />
      </div>
    </Spin>
  )
};

export default RankPage;