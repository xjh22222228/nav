
const DEFAULT_ICON = 'https://www.python.org/static/favicon.ico'

export default {
  title: '依赖包',
  nav: [
    {
      icon: DEFAULT_ICON,
      subtitle: 'HTTP',
      nav: [
        {
          icon: 'https://www.python.org/static/favicon.ico',
          name: 'requests',
          desc: 'requests是一个简单而优雅的HTTP库。',
          link: 'https://requests.readthedocs.io/en/master/',
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
          link: 'https://docs.aiohttp.org/en/stable/',
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
          link: 'https://scrapy.org/',
          language: [
            '',
            '',
            'https://github.com/scrapy/scrapy'
          ]
        },
      ]
    },
    {
      subtitle: '图像',
      icon: DEFAULT_ICON,
      nav: [
        {
          icon: null,
          name: 'Pillow',
          desc: '友好的PIL前叉，是一个出色的图像处理库',
          link: 'https://python-pillow.org/',
          language: [
            '',
            '',
            'https://github.com/python-pillow/Pillow'
          ]
        },
      ]
    },
    {
      subtitle: 'CLI',
      icon: DEFAULT_ICON,
      nav: [
        {
          icon: null,
          name: 'Fire',
          desc: 'Python Fire是一个用于从绝对任何Python对象自动生成命令行界面（CLI）的库。',
          link: 'https://github.com/google/python-fire',
        },
      ]
    }
  ]
}
