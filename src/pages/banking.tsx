import React, { useEffect, useMemo, useRef, useState } from "react";
import { history } from "@umijs/max";
import { Input, BackTop, List, Card, Select, Spin, Popover, Space } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  queryConnectionZipCodeState,
  queryInterestCountryByZipCode,
  queryRejectionCountryByZipCode,
  queryInterestStateByState,
} from "@/services";
import useLocalStorage from "./useLocal";
import useQuery from "./useQuery";
import cls from "@/pages/banking.less";

enum Type {
  Interest,
  Rejection,
}

enum Sort {
  Descending,
  Ascending,
}

export const GetHistoryQuery = () => {
  const query = {} as Record<string, string | undefined>;
  const search = new URLSearchParams(history.location.search);

  for (const [key, value] of search) {
    query[key] = value;
  }
  return query;
};

const BankingPage = () => {
  const { type: locationQueryType = "interest" } = GetHistoryQuery();
  const connectionZipCodeStateRef = useRef<Rule[]>([]);
  const { getConnection, setConnection } = useLocalStorage();

  const [zipCode, setZipCode] = useState<string>("02135");
  const [data, setData] = useState<Option[]>([]);
  const [type, setType] = useState(
    locationQueryType === "interest" ? Type.Interest : Type.Rejection
  );

  const { query, loading } = useQuery();

  const showEmptyError =
    zipCode !== undefined && (zipCode.length < 5 || isNaN(Number(zipCode)));

  const [sort, setSort] = useState(Sort.Descending);

  useEffect(() => {
    init();
    if (zipCode) {
      onSearch(zipCode || "");
    }
  }, [type]);

  const init = async () => {
    const cache = getConnection();

    if (cache && Array.isArray(cache)) {
      connectionZipCodeStateRef.current = cache;
    } else {
      const result: Rule[] = await query(() => queryConnectionZipCodeState());

      connectionZipCodeStateRef.current = result;

      setConnection(result);
    }
  };

  const searchInterest = async (code: string) => {
    const result: Option[] = await query(
      () => queryInterestCountryByZipCode(code),
      (error: any) => {
        if (error?.response?.status === 404) {
          const matchState = connectionZipCodeStateRef.current?.find(
            (o) => o.Zipcode === code
          )?.State;

          searchState(matchState);
        }
      }
    );
    setData(result);
  };

  const searchRejection = async (code: string) => {
    const result: Option[] = await query(() =>
      queryRejectionCountryByZipCode(code)
    );

    setData(result);
  };

  const searchState = async (stateCode?: string) => {
    if (!stateCode) {
      setData([]);
      return;
    }

    const result: Option[] = await query(() =>
      queryInterestStateByState(stateCode)
    );

    setData(result);
  };

  const onSearch = async (v: string) => {
    if (showEmptyError) return;

    if (!v) {
      setZipCode("");
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
  };

  const dataSource = useMemo(() => {
    return data.sort((a: any, b: any) => {
      return sort === Sort.Descending
        ? Number(b.Coefficient) - Number(a.Coefficient)
        : Number(a.Coefficient) - Number(b.Coefficient);
    });
  }, [data, sort]);

  const triggerText =
    type === Type.Interest
      ? "The numerical value of the coefficient indicates how many extra percentage minority borrowers need to pay compared with white borrowers in this bank."
      : "The numerical value of the coefficient indicates the extra probability of loan denial for minority borrowers compared with white borrowers in this bank.";

  const significanceTriggerText =
    "If indicated by “***/**/*”, it means there is a significant difference in the statistics between minority and non-minority groups, with a 99%/95%/90% likelihood, respectively. “Not significant” means there is no statistically significant difference at the considered levels of likelihood.";

  return (
    <Spin spinning={loading}>
      <BackTop />
      <div className="center-wrap">
        <div className={cls.header}>
          <h1 className={cls.title}>Compare the degree of discrimination</h1>
          <h1>
            in
            <div className={cls.condition}>
              <Select
                value={type}
                options={[
                  {
                    label: "interest",
                    value: Type.Interest,
                  },
                  {
                    label: "rejection",
                    value: Type.Rejection,
                  },
                ]}
                onChange={setType}
              />
            </div>
            rates in
            <div
              className={`${cls.condition} ${showEmptyError ? cls.error : ""}`}
            >
              <Input.Search
                maxLength={5}
                inputMode="search"
                placeholder="10001"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onSearch={onSearch}
              />
              {showEmptyError ? (
                <span className={cls.tip}>Enter U.S. ZIP code</span>
              ) : null}
            </div>
          </h1>
        </div>
      </div>
      <div className={cls.divider} />
      <div className="center-wrap">
        <List
          header={
            <div className={cls.listSearch}>
              <h2>
                <Space style={{ marginBottom: 12 }}>
                  <span>Here are {data.length} options for you</span>
                  <Select
                    value={sort}
                    bordered={false}
                    options={[
                      {
                        value: Sort.Descending,
                        label: "Descending",
                      },
                      {
                        value: Sort.Ascending,
                        label: "Ascending",
                      },
                    ]}
                    onChange={setSort}
                  />
                </Space>
              </h2>
              <div className={cls.subTitle}>
                <div>
                  We arrange the results in descending order based on the size
                  of the coefficients, by default
                </div>
                <div style={{ marginTop: 6 }}>{triggerText}</div>
              </div>
            </div>
          }
          dataSource={dataSource}
          className={cls.item}
          renderItem={(item) => {
            return (
              <Card
                key={item.arid}
                style={{ marginBottom: 20 }}
                bodyStyle={{ padding: "20px 20px 12px 20px" }}
              >
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
                    <div className={cls.label}>
                      <Space>
                        <span>Significance</span>
                        <Popover
                          trigger="hover"
                          title={
                            <div style={{ width: 400 }}>
                              {significanceTriggerText}
                            </div>
                          }
                        >
                          <QuestionCircleOutlined />
                        </Popover>
                      </Space>
                    </div>
                    <div className={cls.value}>{item.Significance}</div>
                  </div>
                  <div className={cls.col}>
                    <div className={cls.label}>
                      {item.Zipcode ? "Zip-Code" : "State"}
                    </div>
                    <div className={cls.value}>
                      {item.Zipcode || item.State}
                    </div>
                  </div>
                  <div className={cls.right}>
                    <span className={cls.bank}>{item.Bank_Name}</span>
                    {item.County ? <span>county: {item.County}</span> : null}
                  </div>
                </div>
              </Card>
            );
          }}
        />
      </div>
    </Spin>
  );
};

export default BankingPage;
