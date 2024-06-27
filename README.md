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

## 特性

`发现导航` 的理念就是做一款无需依赖后端服务既简单又方便，没有繁杂的配置和数据库等配置概念, 做到开箱即用。

- 🍰 内置 `800+` 优质网站
- 🍰 支持 [码云 Gitee](https://gitee.com/xiejiahe/nav)
- 🍰 支持用户提交收录
- 🍰 丰富的资源配置系统
- 🍰 支持 SEO 搜索引擎
- 🍰 完全纯静态, 提供自动化部署功能
- 🍰 三叉树分类、结构清晰、分类清晰
- 🍰 支持一个网站关联多个网址
- 🍰 颜值与简约并存，不再是杀马特时代
- 🍰 完全开源，轻松定制化
- 🍰 支持多种浏览模式，创新
- 🍰 支持足迹记忆
- 🍰 支持多种搜索查询
- 🍰 支持自定义引擎搜索
- 🍰 多款高颜值主题切换
- 🍰 支持暗黑模式
- 🍰 支持后台管理, 无需部署
- 🍰 支持从 Chrome 书签导入
- 🍰 多种 Loading 加载动画
- 🍰 多种卡片风格设计
- 🍰 支持检测网站存活状态
- 🍰 支持配置仅自己可见
- 🍰 强大的响应式系统
- 🍰 自动抓取网站图标/名称/描述

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

#### 关于自有部署（不建议）

如果你想部署到自己的服务器，你需要在后台配置补充`请求地址`当每次发生保存时会请求 GET，你需要使用熟悉的任何编程语言写一个服务执行 `git pull && npm run build` 用服务器指向导出的`dist`目录

#### 其他

如果您有更好的部署方式，请给我们提 PR

## 后台

将路由地址修改为 `system` 即可进入，如: https://www.nav3.cn/#/light 修改为 https://www.nav3.cn/#/system

## 书签导入

自动检测满足三级分类导航，其他一律设为未分类：

![](https://raw.githubusercontent.com/xjh22222228/public/gh-pages/nav/import.png)

浏览器打开 [chrome://bookmarks/](chrome://bookmarks/) 导出书签得到 html 文件, 接着从导航网站后台导入即可。

## 升级

将你的仓库克隆下来执行以下命令

```bash
git pull
git remote add upstream https://github.com/xjh22222228/nav.git
git fetch upstream main
git merge upstream/main --allow-unrelated-histories --no-edit
git push

# 或者执行
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

## 贡献

Thank you for your [contribution](https://github.com/xjh22222228/nav/issues), men.

<a href="https://github.com/YutHelloWorld">
  <img src="https://avatars1.githubusercontent.com/u/20860159?s=460&v=4" width="30px" height="30px" />
</a>
<a href="https://github.com/JJJTHuang">
  <img src="https://avatars3.githubusercontent.com/u/22817432?s=460&v=4" width="30px" height="30px" />
</a>
<a href="https://github.com/Fechin">
  <img src="https://avatars1.githubusercontent.com/u/2541482?s=460&v=4" width="30px" height="30px" />
</a>
<a href="https://github.com/setdiaoyong">
  <img src="https://avatars1.githubusercontent.com/u/62551864?s=460&v=4" width="30px" height="30px" />
</a>

## 建议

如果有任何功能上的建议可通过 [issue](https://github.com/xjh22222228/nav/issues) 发起, Thank you.

## 支持

项目于 2018 年到至今一直坚持维护和开源, 经过 N 次的迭代与优化, 如果项目能帮到您是我的荣幸。

您可以请作者喝杯咖啡，继续战斗下去（请备注 Github 名字）~

<img src="https://cdn.jsdelivr.net/gh/xjh22222228/public@gh-pages/img/32.png" width="600">

感谢您的认可：
| ID | 支持金额 |
| --------------------------------------- |----------- |
| [aiyou9](https://github.com/aiyou9) | ￥ 100 |
| [lastares](https://github.com/lastares) | ￥ 25.00 |
| [MrJxySteven](https://github.com/MrJxySteven) | ￥ 20.00 |
| [admol](https://github.com/admol) | ￥ 6.66 |
| 路人甲 | ￥ 50.00 |

## License

[MIT](./LICENSE)
