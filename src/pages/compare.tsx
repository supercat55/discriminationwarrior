import React, { useEffect, useMemo, useState } from "react";
import { BackTop, List, Card, Select, Spin, Popover, Space } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import useQuery from "./useQuery";
import cls from "@/pages/banking.less";
import { GetHistoryQuery } from "@/utils";

enum Type {
  AutoLoanRates = "1",
  CreditCardLoanRates = "2",
  DepositRates = "3",
  MaintenanceFees = "4",
}

enum Sort {
  Descending,
  Ascending,
}

const map: any = {
  [Type.AutoLoanRates]: {
    title: "Auto loan",
    fileType: "json_Web_InstitutionRank_LendingAuto_Full",
    triggerText:
      "The numerical value of the coefficient indicates how much extra interest rate minority borrowers need to pay compared with white borrowers for auto loans at this bank.",
  },
  [Type.CreditCardLoanRates]: {
    title: "Credit card loan",
    fileType: "json_Web_InstitutionRank_LendingCredit_Full",
    triggerText:
      "The numerical value of the coefficient indicates how much extra interest minority credit cardholders need to pay compared with white credit cardholders at this bank.",
  },
  [Type.DepositRates]: {
    title: "Deposit",
    fileType: "json_Web_InstitutionRank_SavingsRate_Full",
    triggerText:
      "The numerical value of the coefficient indicates how much less interest minority depositors receive compared with white depositors at this bank. ",
  },
  [Type.MaintenanceFees]: {
    title: "Maintenance fees",
    fileType: "json_Web_InstitutionRank_SavingsFee_Full",
    triggerText:
      "The numerical value of the coefficient indicates the additional percentage minority account holders need to pay in maintenance fees compared with white account holders at this bank.",
  },
};

const ComparePage = () => {
  const { type = "1" } = GetHistoryQuery();
  const [data, setData] = useState<Option[]>([]);

  const { query, loading } = useQuery();

  const current = map[type];

  const [sort, setSort] = useState(
    type === Type.DepositRates ? Sort.Ascending : Sort.Descending
  );

  useEffect(() => {
    init();
  }, [type]);

  const init = async () => {
    const result: Option[] =
      await require(`/data/compare/${current.fileType}.json`);

    console.log("🚀 ~ init ~ result:", result);

    setData(result);
  };

  const dataSource = useMemo(() => {
    return data.sort((a: any, b: any) => {
      return sort === Sort.Descending
        ? Number(b.Coefficient) - Number(a.Coefficient)
        : Number(a.Coefficient) - Number(b.Coefficient);
    });
  }, [data, sort]);

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
            <div className={cls.condition2}>{current?.title}</div>
            rates in (Country-Wide)
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
                <div style={{ marginTop: 6 }}>{current?.triggerText}</div>
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
                  <div className={cls.col3}>
                    <div className={cls.label}>Bank’s name</div>
                    <div className={cls.value}>{item.Institution_Name}</div>
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

export default ComparePage;
