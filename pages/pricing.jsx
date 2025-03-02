import { useTranslation } from 'react-i18next'
import styles from './pricing.module.scss'
import classNames from 'classnames'
import Link from 'next/link'

export default function Home() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const now = new Date()

  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const limitStr = `${
    firstDayThisMonth.getMonth() + 1
  }.${firstDayThisMonth.getDate()} - ${
    lastDayThisMonth.getMonth() + 1
  }.${lastDayThisMonth.getDate()}`

  const list = [
    {
      title: t('freeVersion'),
      desc: t('freeVersionDesc'),
      price: 0,
      style: {
        background: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
      },
      items: [t('functions'), t('queryCount')],
      widthClass: isEn ? 'w-full' : 'w-40',
    },
    {
      title: t('subeVersion'),
      desc: t('giveTry'),
      price: 99,
      originalPrice: 199,
      style: {
        background:
          'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
      },
      unit: '/' + t('year'),
      items: [
        t('submitNot'),
        t('exportBrowser'),
        t('oneDomain'),
        t('unlimit'),
        t('componentConfig'),
      ],
      widthClass: isEn ? 'w-full' : 'w-48',
    },
    {
      title: t('permanentVersion'),
      desc: t('highlyDesc'),
      price: 299,
      originalPrice: 699,
      subtitle: t('highly'),
      style: {
        background: 'black',
      },
      items: [
        t('ownDep'),
        t('exportBrowser'),
        t('submitNot'),
        t('domainNoLimit'),
        t('unlimit'),
        t('commercial'),
        t('componentConfig'),
        t('docs'),
        t('techSupport'),
      ],
      widthClass: isEn ? 'w-60' : 'w-40',
      limited: true,
    },
  ]

  return (
    <div className={styles.pricing}>
      <div className="text-center font-bold text-4xl sm:text-5xl pt-16">
        {t('chooseVer')}
      </div>
      <div className="text-center font-bold text-base pt-5 text-slate-600">
        {t('sendMail')}
      </div>
      <div className="text-center font-bold text-base pt-5 text-blue-600 underline">
        <Link href="/disclaimers">{t('disclaimers')}</Link>
      </div>

      <div className={styles.pricingBox}>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <div
              key={item.title}
              className="bg-white text-center rounded-xl shadow-lg overflow-hidden pb-7"
            >
              <div className="h-4 sm:h-7">
                <div className="p-1 text-orange-100 text-sm" style={item.style}>
                  {item.subtitle}
                </div>
              </div>
              <div className="font-bold text-3xl mt-8">{item.title}</div>
              <div className="text-sm mt-3 text-slate-900">{item.desc}</div>
              <div className="font-bold text-3xl mt-5 mb-5 relative">
                ￥{item.price}
                {item.unit && (
                  <span className="text-base ml-1">{item.unit}</span>
                )}
                <del className="text-sm text-slate-300 font-normal ml-1">
                  {item.originalPrice && `￥${item.originalPrice}`}
                </del>
                {item.limited && (
                  <div className={styles.limited}>限时优惠 {limitStr}</div>
                )}
              </div>
              {item.items.map((text) => (
                <div key={text} className="flex justify-center px-4">
                  <div
                    className={classNames(
                      'flex justify-start items-center mt-1.5',
                      item.widthClass
                    )}
                  >
                    <img src="/ok.svg" className="w-4 mr-2" />
                    <span className="text-left">{text}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <img
            src="https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/img/32.png"
            width="600"
          />
        </div>
      </div>
    </div>
  )
}
