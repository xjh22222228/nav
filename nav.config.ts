import { IConfig } from './src/types'

const c: IConfig = {
  // [Mondatory], Please replace following Github url with your own Github address which you forked in.
  // [必填], 请填写您的仓库地址， 地址最后不要带 /
  gitRepoUrl: 'https://github.com/xjh22222228/nav',

  // 部署平台
  // 可选 Github | Gitee，如果是 Gitee 上面一定要填写 Gitee 的仓库地址
  // Gitee 官方图片新增防盗链，不要使用上传图片功能，自己填入图片地址
  // 作者Gitee仓库地址 https://gitee.com/xiejiahe/nav
  provider: 'Github',

  // Deployment branch name
  // 部署分支
  branch: 'main',

  // Whether the route is in Hash mode, if it is deployed on github pages, it must be set to true
  // 路由是否Hash模式, 如果是部署在github pages 务必设为 true
  hashMode: true,
}

export default c
