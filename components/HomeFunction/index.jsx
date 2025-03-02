import React from 'react'
import styles from './index.module.scss'
import ClassScroll from 'class-scroll'
import { useTranslation } from 'react-i18next'

export default function HomeFunction() {
  const { t } = useTranslation()

  const list = [
    {
      title: t('pureStatic'),
      desc: t('pureStaticDesc'),
      src: '/IE.svg',
    },
    {
      title: t('access'),
      desc: t('accessDesc'),
      src: '/auth.svg',
    },
    {
      title: t('importBook'),
      desc: t('importBookDesc'),
      src: '/chrome.svg',
    },
    {
      title: t('exportBook'),
      desc: t('exportBookDesc'),
      src: '/chrome.svg',
    },
    {
      title: t('queryData'),
      desc: t('queryDataDesc'),
      src: '/search.svg',
    },
    {
      title: t('deploymentPlatform'),
      desc: t('deploymentPlatformDesc'),
      src: '/tool.svg',
    },
    {
      title: t('theme'),
      desc: t('themeDesc'),
      src: '/card.svg',
    },
    {
      title: t('cardAd'),
      desc: t('cardAdDesc'),
      src: '/ad.svg',
    },
    {
      title: t('responsiveDesign'),
      desc: t('responsiveDesignDesc'),
      src: '/respon.svg',
    },
    {
      title: t('bind'),
      desc: t('bindDesc'),
      src: '/bind.svg',
    },
    {
      title: t('submit'),
      desc: t('submitDesc'),
      src: '/add.svg',
    },
    {
      title: t('component'),
      desc: t('componentDesc'),
      src: '/component.svg',
    },
    {
      title: t('inspect'),
      desc: t('inspectDesc'),
      src: '/inspect.svg',
    },
    {
      title: t('platform'),
      desc: t('platformDesc'),
      src: '/github.svg',
    },
    {
      title: t('thoroughly'),
      desc: t('thoroughlyDesc'),
      src: '/shoot.svg',
    },
    {
      title: t('darkMode'),
      desc: t('darkModeDesc'),
      src: '/dark.svg',
    },
    {
      title: t('tailwindcss'),
      desc: t('tailwindcssDesc'),
      src: '/tailwindcss.svg',
    },
  ]

  React.useEffect(() => {
    const items = document.querySelectorAll('.func-item')
    const params = []
    items.forEach((el) => {
      params.push({
        el,
        className: 'animate__animated animate__fadeInUp',
        threshold: 0.5,
      })
    })
    const classScroll = new ClassScroll(params)
    classScroll.init()

    return () => {
      classScroll.destroy()
    }
  }, [])

  return (
    <section className={styles.function}>
      <div className="font-bold text-black text-4xl mb-14 sm:text-5xl">
        {t('features')}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-y-16">
        {list.map((item) => (
          <div
            key={item.title}
            className="func-item text-center flex flex-col items-center justify-start"
          >
            <img
              src={item.src}
              className="w-14 h-14 min-w-14 min-h-14"
              loading="lazy"
            />
            <div className="mt-4 text-2xl font-bold text-black">
              {item.title}
            </div>
            <div className="mt-2">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
