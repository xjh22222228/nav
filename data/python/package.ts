
const DEFAULT_ICON = 'https://www.python.org/static/favicon.ico'

export default {
  title: '依赖包',
  icon: DEFAULT_ICON,
  nav: [
    {
      title: 'HTTP/爬虫',
      nav: [
        {
          icon: 'https://www.python.org/static/favicon.ico',
          name: 'requests',
          desc: 'requests是一个简单而优雅的HTTP库。',
          url: 'https://requests.readthedocs.io/en/master/',
          language: [
            '',
            '',
            'https://github.com/psf/requests'
          ]
        },
        {
          icon: 'https://raw.githubusercontent.com/aio-libs/aiohttp/master/docs/_static/aiohttp-icon-128x128.png',
          name: 'aiohttp',
          desc: '用于asyncio和Python的异步HTTP客户端/服务器框架',
          url: 'https://docs.aiohttp.org/en/stable/',
          language: [
            '',
            '',
            'https://github.com/aio-libs/aiohttp'
          ]
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/733635?s=200&v=4',
          name: 'Scrapy',
          desc: '一个用于Python的快速高级Web爬虫框架。',
          url: 'https://scrapy.org/',
          language: [
            '',
            '',
            'https://github.com/scrapy/scrapy'
          ]
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/983927?s=200&v=4',
          name: 'selenium',
          desc: '浏览器自动化框架和生态系统。',
          url: 'https://www.selenium.dev/',
          language: [
            '',
            '',
            'https://github.com/SeleniumHQ/selenium/'
          ]
        },
        {
          name: 'beautifulsoup',
          desc: '可以从HTML或XML文件中提取数据的Python库',
          url: 'https://beautifulsoup.readthedocs.io/zh_CN/v4.4.0/',
        },
      ]
    },
    {
      title: '图像',
      nav: [
        {
          name: 'Pillow',
          desc: '友好的PIL前叉，是一个出色的图像处理库',
          url: 'https://python-pillow.org/',
          language: [
            '',
            '',
            'https://github.com/python-pillow/Pillow'
          ]
        },
      ]
    },
    {
      title: 'CLI',
      nav: [
        {
          name: 'Fire',
          desc: 'Python Fire是一个用于从绝对任何Python对象自动生成命令行界面（CLI）的库。',
          url: 'https://github.com/google/python-fire',
        },
        {
          name: 'colorama',
          desc: 'Python中简单的跨平台彩色终端文本',
          url: 'https://pypi.org/project/colorama/',
        },
      ]
    }
  ]
}
