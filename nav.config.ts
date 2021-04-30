import { IConfig } from './src/types'

const c: IConfig = {
  // [必填], 请填写您的仓库地址
  gitRepoUrl: 'https://github.com/xjh22222228/nav',

  // 部署分支
  branch: 'main',

  // 路由是否Hash模式, 如果是部署在github pages 务必设为 true
  hashMode: true,

  // 是否显示右上角的 Github 图标
  showGithub: true,

  // 您的网站地址，有利于SEO
  homeUrl: 'https://nav3.cn',

  // 网站标题
  title: '发现导航 - 精选实用导航网站',

  // 网站描述
  description: '发现导航 - 精选实用导航网站',

  // 网站关键字
  keywords: '导航,前端资源,社区站点,设计师,实用工具,学习资源,运营,网络安全,node.js',

  // 默认主题: Light | Sim | Side | App | Shortcut
  theme: 'Light',

  // 网站底部内容, 版权信息、备案号, 可以是 HTML
  footerContent: `
    <div style="font-weight: bold;">共收录\${total}个网站</div>
    <div>Copyright © 2018-2021 nav3.cn, All Rights Reserved</div>
  `,

  // 阿里巴巴矢量图库 https://www.iconfont.cn/
  // 用在 Side 主题一级、二级菜单图标展示
  iconfontUrl: '//at.alicdn.com/t/font_2522843_wl70o31sy6.js',

  // 百度统计地址
  // https://tongji.baidu.com/web/welcome/login
  baiduStatisticsUrl: 'https://hm.baidu.com/hm.js?4582be7af7e7c95ef75351e07c6c32ba',

  // CNZZ 统计地址
  // https://www.cnzz.com/o_index.php
  cnzzStatisticsUrl: '',

  // Sim 主题配置
  simThemeConfig: {
    // 海报图
    posterImageUrls: [
      'https://raw.sevencdn.com/xjh22222228/nav/image/sim-wallpaper.jpg'
    ],
    description: '这里收录多达 <b>${total}</b> 个优质网站， 助您工作、学习和生活'
  }
}

export default c
