<p align="center">
  <a href="https://nav3.cn/?g">
    <img src="src/assets/logo.png" width="130" />
  </a>
  <br />
  <b>发现导航</b>
  <p align="center">一个纯静态、支持SEO、在线编辑的强大导航网站，希望您会喜欢</p>
  <p align="center">内置收录多达 800+ 优质网站， 助您工作、学习和生活</p>
  <p align="center">
    <!-- <a href="README_en.md">
      <img src="https://img.shields.io/badge/lang-English-red.svg?longCache=true&style=flat-square">
    </a> -->
    <img src="https://img.shields.io/github/v/release/xjh22222228/nav" />
    <a href="https://github.com/xjh22222228/nav/stargazers"><img src="https://img.shields.io/github/stars/xjh22222228/nav" alt="Stars"/></a>
    <img alt="Angular" src="https://img.shields.io/static/v1.svg?label=&message=Angular&style=flat-square&color=C82B38">
    <img src="https://img.shields.io/github/license/xjh22222228/nav" />
  </p>
</p>

## 特性

三不需：`无需数据库`、`无需服务器`、`无需成本`

`发现导航` 的理念就是做一款无需依赖后端服务既简单又方便，没有繁杂的配置和数据库等配置概念, 做到开箱即用。

- 🍰 内置 `800+` 优质网站
- 🍰 支持 [码云 Gitee](https://gitee.com/xiejiahe/nav)
- 🍰 支持从浏览器书签导入
- 🍰 支持将数据导出到浏览器书签
- 🍰 支持用户提交收录
- 🍰 丰富的资源配置系统
- 🍰 支持 SEO 搜索引擎
- 🍰 支持网站关联多个网址
- 🍰 支持检测网站存活状态
- 🍰 支持配置仅自己可见
- 🍰 自动抓取网站图标/名称/描述
- 🍰 支持暗黑模式
- 🍰 支持后台管理, 无需部署
- 🍰 支持多种浏览模式，创新
- 🍰 支持足迹记忆
- 🍰 支持多种搜索查询
- 🍰 支持自定义引擎搜索
- 🍰 多款高颜值主题切换
- 🍰 强大的响应式系统
- 🍰 多种 Loading 加载动画
- 🍰 多种卡片风格设计
- 🍰 完全纯静态, 提供自动化部署功能
- 🍰 三叉树分类、结构清晰、分类清晰
- 🍰 颜值与简约并存，不再是杀马特时代
- 🍰 完全开源，轻松定制化

## 预览

- [https://nav3.cn/](https://nav3.cn/)
- [https://faxian.vercel.app/](https://faxian.vercel.app/)
- [https://xjh22222228.github.io/nav-web/](https://xjh22222228.github.io/nav-web/)

![Preview](https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/1.png)
![Preview](https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/8.png)
![Preview](https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/3.png)
![Preview](https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/4.png)
![Preview](https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/6.png)
![Preview](https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/9.png)
![Preview](https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/7.png)

## 可以干嘛

- 公司部署，内部系统网站，不需要员工收藏各种链接
- 做为个人书签，有些功能浏览器是没有的
- 个人导航网站，分享、价值、发现

## 部署

零成本部署，像数 `321` 一样简单。

#### gh-pages (免费)

1、右上角点击 `Fork` 当前项目。

2、[https://github.com/settings/tokens/new](https://github.com/settings/tokens/new) 申请 `token`, 勾选相应的权限, 如果不懂就全部选中，复制并保存 Token；[Gitee 申请点这里](https://gitee.com/profile/personal_access_tokens/new)

3、https://github.com/你的用户名/nav/settings/secrets/actions/new 添加申请的 token， name 填写 `TOKEN` 大写。

4、打开 https://github.com/你的用户名/nav/actions 开启 action 自动部署

5、修改项目根目录配置文件 [nav.config.ts](nav.config.ts) 只需要修改仓库地址

6、打开 https://你的用户名.github.io/nav 就能看到一个非常强大的导航网站了。

#### Netlify 推荐(免费)

作者目前使用，速度较快

[https://www.netlify.com/](https://www.netlify.com/)

#### Vercel 推荐(免费)

国内访问速度较慢，建议测试后使用

[https://github.com/apps/vercel](https://github.com/apps/vercel)

#### 关于自有部署

前提服务器必须能访问公网。

将代码拉到服务器 `git clone https://github.com/xjh22222228/nav.git` 还需要安装`Node >= 18`

执行 `npm i && npm i pm2 -g && npm run build` 用服务器指向导出的 `dist` 目录, 尝试访问

使用项目自带服务器 [server.js](server.js) ，需要修改文件内的服务器仓库位置

在导航网站后台系统配置补充 `请求地址` 当每次发生保存时会请求下面启动的服务器实现自动部署。

```bash
# 启动 公网IP:7777/server
npm run server
```

#### 其他

如果您有更好的部署方式，请给我们提 PR

## 后台

将路由地址修改为 `system` 即可进入，如: https://www.nav3.cn/#/light 修改为 https://www.nav3.cn/#/system

## 升级

将你的仓库克隆下来执行以下命令

```bash
git pull
git remote add upstream https://gitee.com/xiejiahe/nav.git
git fetch upstream main
git merge upstream/main --allow-unrelated-histories --no-edit
git push

# 如果安装了node只需执行
npm run update
```

## 更新日志

[CHANGELOG](https://github.com/xjh22222228/nav/releases)

## 开发构建

NODE: >= v18

```bash
# 下载
git clone --depth=1 https://github.com/xjh22222228/nav.git

cd nav

# 安装依赖 NODE: v18
yarn

# 启动
yarn start

# 打包
yarn build
```

## 建议

如果有任何功能上的建议可通过 [issue](https://github.com/xjh22222228/nav/issues) 发起, Thank you.

## 支持

项目于 2018 年到至今一直坚持维护和开源, 经过 N 次的迭代与优化, 如果项目能帮到您是我的荣幸。

您可以请作者喝杯咖啡，继续战斗下去（请备注 Github 名字）~

<img src="https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/img/32.png" width="600">

感谢您的认可：

<img src="https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/thank.png" width="200" />

## License

[MIT](./LICENSE)
