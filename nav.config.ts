import { IConfig } from './src/types'

// 网站 LOGO 替换根目录下的 logo.png， 务必为 png 后缀
const c: IConfig = {
  // [必填], 请填写您的仓库地址
  gitRepoUrl: 'https://github.com/xjh22222228/nav',

  // 路由是否Hash模式, 如果是部署在github pages 务必设为 true
  hashMode: true,

  // 您的网站地址，这对于SEO很重要
  homeUrl: 'https://nav3.cn',

  // 网站标题
  title: '发现导航 - 精选实用导航网站',

  // 网站描述
  description: '发现导航 - 精选实用导航网站',

  // 网站关键字
  keywords: '导航,前端资源,社区站点,设计师,实用工具,学习资源,运营,网络安全,node.js',

  // 默认主题: Light | Sim
  theme: 'Light',

  // 搜索引擎列表, 为空时不显示搜索引擎
  // 自定义引擎 icon 请使用网络图标
  searchEngineList: [
    {
      name: '站内',
      icon: 'assets/logo.png',
      placeholder: '站内搜索'
    },
    {
      name: '百度',
      url: 'https://www.baidu.com/s?wd=',
      icon: 'assets/engine/baidu.svg',
      placeholder: '百度一下'
    },
    {
      name: 'Google',
      url: 'https://www.google.com/search?q=',
      icon: 'assets/engine/google.svg',
    },
    {
      name: '必应',
      url: 'https://cn.bing.com/search?q=',
      icon: 'assets/engine/bing.svg',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/search?q=',
      icon: 'assets/engine/github.svg',
      placeholder: 'Search GitHub'
    },
    {
      name: '知乎',
      url: 'https://www.zhihu.com/search?type=content&q=',
      icon: 'assets/engine/zhihu.svg',
    },
    {
      name: '豆瓣',
      url: 'https://search.douban.com/book/subject_search?search_text=',
      icon: 'assets/engine/douban.svg',
      placeholder: '书名、作者、ISBN'
    }
  ],

  // 网站底部内容, 版权信息、备案号, 可以是 HTML
  footerContent: `
    <div style="font-weight: bold;">共收录\${total}个网站</div>
  `,

  // 百度统计地址
  // https://tongji.baidu.com/web/welcome/login
  baiduStatisticsUrl: 'https://hm.baidu.com/hm.js?4582be7af7e7c95ef75351e07c6c32ba',

  // CNZZ 统计地址
  // https://www.cnzz.com/o_index.php?
  cnzzStatisticsUrl: '',

  // Light 主题配置
  lightThemeConfig: {
    // https://www.nav3.cn/#/light?q=grabient
    backgroundLinear: [
      'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
      'linear-gradient(90deg, #FEE140 0%, #FA709A 100%)',
      'linear-gradient(0deg, #08AEEA 0%, #2AF598 100%)',
      'linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)',
      'linear-gradient(19deg, #FAACA8 0%, #DDD6F3 100%)',
      'linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)',
      'linear-gradient(180deg, #52ACFF 25%, #FFE32C 100%)',
      'linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)',
      'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)',
      'linear-gradient(90deg, #00DBDE 0%, #FC00FF 100%)',
      'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
      'linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)',
      'linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
      'linear-gradient(90deg, #FAD961 0%, #F76B1C 100%)',
      'linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
      'linear-gradient(45deg, #FBDA61 0%, #FF5ACD 100%)',
      'linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
      'linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)',
      'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
      'linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)',
      'linear-gradient(180deg, #A9C9FF 0%, #FFBBEC 100%)',
      'linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
      'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
      'linear-gradient(132deg, #F4D03F 0%, #16A085 100%)',
      'linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)',
      'linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)'
    ]
  },

  // Sim 主题配置
  simThemeConfig: {
    // 海报图
    // 请不要放在项目里头, 填写Url
    posterImageUrls: [
      'assets/img/wallpaper.jpg'
    ],
    description: '这里收录多达 <b>${total}</b> 个优质网站， 助您工作、学习和生活'
  }
}

export default c
