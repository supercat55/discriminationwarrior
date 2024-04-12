import { history } from '@umijs/max';
import { Card } from 'antd';
import cls from '@/pages/home.less';

const data = [
  {
    middleText: 'Compare interest rates',
    icon: require('@/assets/icon1.png'),
    bottomText: 'Learn how much extra interest rate that minorities pay.',
    type: 'interest'
  },
  {
    middleText: 'Compare rejection rates',
    icon: require('@/assets/icon2.png'),
    bottomText: 'Check if minorities are more likely to be rejected when applying for loans.',
    type: 'rejection'
  },
]

const HomePage = () => {
  const goToPage = (type: string) => {
    history.push(`/banking?type=${type}`)
  };

  return (
    <div>
      <div className={cls.header}>
        <div className={cls.content}>
          <h1 className={cls.title}>Our Vision</h1>
          <div className={cls.desc}>
            <div>When you're seeking a minority-friendly mortgage lender, we provide valuable insights by highlighting the racial disparities in interest rates and rejection rates among banks at the zip code level.</div>
            <div className={cls.hrefText}>
              <a href="https://drive.google.com/file/d/1qDt1RZQcQziXk8dx2DtsdctTLHSobZqU/view?usp=drive_link">
                We rank the racial discrimination of banks in a specific zip code by using this methodology.
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={cls.main}>
        <h1>Banking loan shopping tools</h1>
        <div className={cls.wrap}>
          {
            data.map(item => (
              <Card
                hoverable
                className={cls.item}
                title={<div className={cls.top}>Mortgage loans</div>}
                bodyStyle={{ padding: 0 }}
                key={item.middleText}
                onClick={() => goToPage(item.type)}
              >
                <div className={cls.middle}>
                  <img src={item.icon} className={cls.icon} />
                  <p>{item.middleText}</p>
                </div>
                <div className={cls.bottom}>
                  {item.bottomText}
                </div>

              </Card>
            ))
          }
        </div>
      </div>
    </div>
  )
};

export default HomePage;