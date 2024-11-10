import { history } from "@umijs/max";
import { Card, Row, Col } from "antd";
import cls from "@/pages/home.less";

const data = [
  {
    title: "Mortgage loans",
    middleText: "Compare interest rates",
    icon: require("@/assets/Pic_House.png"),
    bottomText: "Learn how much extra interest rate that minorities pay.",
    type: "interest",
  },
  {
    title: "Mortgage loans",
    middleText: "Compare rejection rates",
    icon: require("@/assets/Pic_House.png"),
    bottomText:
      "Check if minorities are more likely to be rejected when applying for loans.",
    type: "rejection",
  },
  {
    title: "Auto Loans",
    middleText: "Compare auto loan rates",
    icon: require("@/assets/Pic_Car.png"),
    bottomText:
      "Learn how much extra interest rate minority borrowers pay for auto loans.",
    type: "1",
  },
  {
    title: "Credit Cards",
    middleText: "Compare credit card loan rates",
    icon: require("@/assets/Pic_CreditCard.png"),
    bottomText:
      "See if credit card loan rates are higher for minority borrowers compared to non-minority communities.",
    type: "2",
  },
  {
    title: "Deposits",
    middleText: "Compare deposit rates",
    icon: require("@/assets/Pic_PiggyBank.png"),
    bottomText:
      "Discover if minority communities receive lower deposit rates compared to non-minority areas.",
    type: "3",
  },
  {
    title: "Fees",
    middleText: "Compare account maintenance fees",
    icon: require("@/assets/Pic_Fee.png"),
    bottomText:
      "Check whether minority communities are charged higher maintenance fees by financial institutions.",
    type: "4",
  },
];

const HomePage = () => {
  const goToPage = (type: string) => {
    if (isNaN(Number(type))) {
      history.push(`/banking?type=${type}`);
    } else {
      history.push(`/compare?type=${type}`);
    }
  };

  return (
    <div>
      <div className={cls.header}>
        <div className={cls.content}>
          <h1 className={cls.title}>Our Vision</h1>
          <div className={cls.desc}>
            <div>
              When you‘re seeking fair banking services, we provide valuable
              insights by highlighting racial disparities in the following
              financial products: mortgage loans, auto loan rates, credit card
              loan rates, deposit rates, and account maintenance fees.
            </div>
            <div className={cls.hrefText}>
              <a href="https://drive.google.com/file/d/1qDt1RZQcQziXk8dx2DtsdctTLHSobZqU/view?usp=drive_link">
                For mortgage loans, we rank the racial discrimination of banks
                by using this methodology.
              </a>
            </div>
            <div>
              <a href="https://drive.google.com/file/d/1qDt1RZQcQziXk8dx2DtsdctTLHSobZqU/view?usp=drive_link">
                For other financial products, we rank the racial discrimination
                of banks by using this methodology.
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={cls.main}>
        <h1>Banking loan shopping tools</h1>
        <Row className={cls.wrap} gutter={[24, 24]}>
          {data.map((item) => (
            <Col xs={12} sm={8} md={6} lg={6} xl={6} xxl={4} key={item.type}>
              <Card
                hoverable
                className={cls.item}
                title={<div className={cls.top}>{item.title}</div>}
                bodyStyle={{ padding: 0 }}
                key={item.middleText}
                onClick={() => goToPage(item.type)}
              >
                <div className={cls.middle}>
                  <img src={item.icon} className={cls.icon} />
                  <p>{item.middleText}</p>
                </div>
                <div className={cls.bottom}>{item.bottomText}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
