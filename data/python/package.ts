
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
      title: '运算',
      nav: [
        {
          name: 'numpy',
          desc: '使用Python进行科学计算的基本软件包。',
          url: 'https://numpy.org/',
          language: [
            '',
            '',
            'https://github.com/numpy/numpy'
          ]
        },
      ]
    },
    {
      title: '数据分析',
      nav: [
        {
          icon: 'https://avatars1.githubusercontent.com/u/21206976?s=200&v=4',
          name: 'pandas',
          desc: '功能强大的Python数据分析工具包',
          url: 'https://github.com/pandas-dev/pandas',
        },
      ]
    },
    {
      title: 'CLI',
      nav: [
        {
          name: 'rich',
          desc: 'Rich是一个Python库，用于在终端中提供富文本和精美的格式',
          url: 'https://github.com/willmcgugan/rich',
        },
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
        {
          icon: 'https://avatars1.githubusercontent.com/u/12731565?s=200&v=4',
          name: 'tqdm',
          desc: '适用于Python和CLI的快速，可扩展的进度栏',
          url: 'https://github.com/tqdm/tqdm',
        },
        {
          name: 'paramiko',
          desc: '领先的Python SSHv2协议库',
          url: 'https://github.com/paramiko/paramiko',
        },
        {
          name: 'click',
          desc: 'Python可组合命令行界面工具包',
          url: 'https://github.com/pallets/click',
        },
      ]
    }
  ]
}
