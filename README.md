<p align="center">
  <a href="https://nav3.cn/?g">
    <img src="https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/logo.svg" width="130" />
  </a>
  <br />
  <b>发现导航</b>
  <p align="center">一个纯静态、支持SEO、在线编辑的强大导航网站，希望您会喜欢</p>
  <p align="center">内置收录多达 800+ 优质网站， 助您工作、学习和生活</p>
  <p align="center">
    <img src="https://img.shields.io/github/v/release/xjh22222228/nav" />
    <a href="https://github.com/xjh22222228/nav/stargazers"><img src="https://img.shields.io/github/stars/xjh22222228/nav" alt="Stars"/></a>
    <img alt="Angular" src="https://img.shields.io/static/v1.svg?label=&message=Angular&style=flat-square&color=C82B38">
    <img src="https://img.shields.io/github/license/xjh22222228/nav" />
  </p>
</p>

<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="
      https://api.star-history.com/svg?repos=xjh22222228/nav&type=Date&theme=dark
    "
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="
      https://api.star-history.com/svg?repos=xjh22222228/nav&type=Date
    "
  />
  <img
    alt="Star History Chart"
    src="https://api.star-history.com/svg?repos=xjh22222228/nav&type=Date"
  />
</picture>

## 特性

三不需：`无需数据库`、`无需服务器`、`无需成本`

`发现导航` 的理念就是做一款无需依赖后端服务既简单又方便，没有繁杂的配置和数据库等配置概念, 做到开箱即用。

- 🍰 内置 `800+` 优质网站
- 🍰 支持 [码云 Gitee](https://gitee.com/xiejiahe/nav)
- 🍰 支持从浏览器书签导入
- 🍰 支持将数据导出到浏览器书签
- 🍰 支持用户提交收录
- 🍰 支持自有部署/Fork
- 🍰 丰富的资源配置系统
- 🍰 支持 SEO 搜索引擎
- 🍰 支持网站关联多个网址
- 🍰 支持检测网站存活状态
- 🍰 支持配置仅自己可见
- 🍰 自动抓取网站图标/名称/描述
- 🍰 海量小组件个性化定制
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

## 预览

- [https://nav3.cn](https://nav3.cn)

![Preview](https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/preview.gif)

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

5、修改项目根目录配置文件 [nav.config.yaml](nav.config.yaml) 只需要修改仓库地址 `gitRepoUrl` 字段

6、打开 https://你的用户名.github.io/nav 就能看到一个非常强大的导航网站了。

#### Netlify 推荐(免费)

作者目前使用，速度较快, 打包路径 `dist/browser`

[https://www.netlify.com/](https://www.netlify.com/)

#### Vercel 推荐(免费)

国内访问速度较慢，建议测试后使用

[https://github.com/apps/vercel](https://github.com/apps/vercel)

#### 自有部署

自有部署一直不是发现导航的需求目标，但陆续接到需求，决定从`v8.8.0`版本开始支持！

#### Fork vs 自有部署

|          | 自有部署         | Fork             |
| -------- | ---------------- | ---------------- |
| 速度     | 保存即时生效     | 需要等待构建完成 |
| 成本     | 需要自己有服务器 | 各种平台免费部署 |
| 数据存储 | 需要定时备份     | 永久存储         |
| 存活状态 | 未知             | 只要`GitHub`还在 |
| 图片     | 走服务器带宽     | 免费 CDN 加速    |

自有部署操作速度快，无需等待，成本较高，按需选择。

## 配置说明

只需要修改根目录 `nav.config.yaml` 以下相关字段
|Fork |自有部署 | 字段 | 说明 |
| --------------------------------------------- | -------- |--- |--- |
|√ | | gitRepoUrl | 填写您的仓库地址 |
|√ | | branch | 部署分支 |
|√ | √| hashMode | 路由是否 Hash 模式, 如果是部署在 `github pages` 务必设为 true |
| | √| password | 自有部署登录密码，`Fork` 用户无需填写 |
| | √| address | 自有部署, 一旦填写认为你是自有部署 |
|√| √| email | 用户提交收录通知 |
| | √| mailConfig | 自有部署，用户收录通知邮箱配置 |
|√ | | imageRepoUrl | 图片仓库, 默认主仓库 `https://github.com/xjh22222228/image?branch=main` |

## 后台

将路由地址修改为 `system` 即可进入，如: https://www.nav3.cn 修改为 https://www.nav3.cn/system

## 升级

#### 自动

仅限于 `Fork` 用户

[点这里安装 Pull](https://github.com/apps/pull) ， 只要有升级会自动给你的仓库提交 `Pull Requests` 点击合并即可。

#### 手动

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

## 支持

项目于 2018 年到至今一直坚持维护和开源, 经过 N 次的迭代与优化, 如果项目能帮到您是我的荣幸。

您可以请作者喝杯咖啡，继续战斗下去

<img src="https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/img/32.png" width="600">

## LICENSE

For commercial sites, themes, projects, and applications, keep your source code private/proprietary by purchasing a [Commercial License](https://official.nav3.cn/pricing).

Licensed under the GNU General Public License 3.0 for compatible open source projects and non-commercial use.

Copyright 2024-present xiejiahe
