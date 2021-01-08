
<p align="center">
  <a href="https://nav3.cn/?g">
    <img src="src/assets/logo.png" width="130" />
  </a>
  <br />
  <b>发现导航</b>
  <p align="center">一个纯静态、易管理的强大导航网站，希望您会喜欢</p>
  <p align="center">内置收录多达 800+ 优质网站， 助您工作、学习和生活</p>
  <p align="center">
    <img src="https://img.shields.io/github/v/release/xjh22222228/nav" />
    <a href="https://github.com/xjh22222228/nav/stargazers"><img src="https://img.shields.io/github/stars/xjh22222228/nav" alt="Stars"/></a>
    <img alt="Angular" src="https://img.shields.io/static/v1.svg?label=&message=Angular&style=flat-square&color=C82B38">
    <img src="https://img.shields.io/github/license/xjh22222228/nav" />
    <a href="https://hits.dwyl.com/xjh22222228/nav">
      <img src="https://hits.dwyl.com/xjh22222228/nav.svg" />
    </a>
  </p>
</p>

<br />
<br />



## 预览
**主题**

- [sim 在线预览](https://nav3.cn/#/sim)
- [light 在线预览](https://nav3.cn/#/light)

![Preview](media/screenshot1.png)
![Preview](media/screenshot2.png)

![Preview](media/screenshot3.png)
![Preview](media/screenshot4.png)








## 内置
- [TypeScript](https://www.typescriptlang.org/)
- [Angular v9](https://angular.io/)
- [jQuery](https://jquery.com/)






## 拥有出色的特性
- [√] 内置 `800+` 实用网站。
- [√] 三叉树分类、结构清晰、分类清晰。
- [√] 颜值与简约并存，不再是杀马特时代。
- [√] 支持3种浏览模式，创新。
- [√] 支持足迹记忆。
- [√] 支持移动端浏览。
- [√] 支持搜索查询。
- [√] 支持自定义引擎搜索。
- [√] 纯静态, 提供自动化部署功能。
- [√] 完全开源，轻松定制化。
- [√] 多款主题切换。
- [√] 支持暗黑模式。


## 贡献
[点击这里](https://github.com/xjh22222228/nav/tree/master/data)

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




## 开发构建
``` bash
# 下载
git clone --depth=1 https://github.com/xjh22222228/nav.git

# 安装依赖
npm install

# 启动[可选]
npm start

# 打包
npm run build
```


## 部署
推荐使用 `github pages` 服务, 这样就不需要提供服务器, 并且项目里自带了自动化部署服务，像数 `321` 一样简单。

1、Fork 当前项目。

2、[https://github.com/settings/tokens](https://github.com/settings/tokens) 申请 token, 勾选相应的权限, 如果不懂就全部选中。

3、到 https://github.com/用户名/nav/settings/secrets/new  添加刚刚申请的token， name填写 `TOKEN` 大写。

4、打开 https://github.com/用户名/nav/actions 点击 `绿色按钮`

5、往仓库推送一条Commit (非常重要)。

6、5分钟后打开 https://用户名.github.io/nav 就能看到一个非常强大的导航网站了。


注：如果想部署到自己的域名，那么以上教程同样适合，因为它提供了自动化部署， 之后可以通过 `CNAME` 或 `反向代理` 实现：

```conf
# nginx

server {
    listen       80;
    server_name  www.nav3.cn nav3.cn;

    location / {
        proxy_pass https://xjh22222228.github.io/nav/;
    }
}
```


## 配置
所有可配置位于文件 `nav.config.ts`。


## 更新数据
只需要关注根目录 `data` 文件夹, 如果你使用了上面教程提供的自动化部署服务，那么当更新数据后大概5分钟即可看到。

```js
{
  title: '工具',
  icon: 'https://example/favicon.ico',
  nav: [
    {
      title: '网站',
      collapsed: false, // 默认展开，设置 false 折叠
      showSideIcon: false, // 右侧边图标，如果设置Icon则默认显示
      nav: [
        {
          name: '发现导航',
          desc: '发现导航 - 精选实用导航网站',
          url: 'https://nav3.cn',
        }
      ]
    }
  ]
}
```




## 图标
图标是支持继承的，每一级的 `icon` 字段都是可选，如果当前没有就会继承上一级Icon,

```js
{
  title: 'Example',
  icon: 'https://example/icon',
  nav: [
    {
      showSideIcon: false, // 如果这层设置 icon 图标会默认在右侧边栏显示ICON, 设置 false 关闭显示
      title: 'Example',
      // icon: 'https://favicon.ico',
      nav: [
        {
          // icon: 'https://favicon.ico',
        },
      ]
    }
  ]
}
```





## 建议
如果有任何功能上的建议可通过 [issue](https://github.com/xjh22222228/nav/issues) 发起, Thank you.



## 支持
如果能帮到您，可以请作者喝杯咖啡~

<img src="https://raw.sevencdn.com/xjh22222228/public/gh-pages/img/32.png" width="600">






## License
[MIT](https://opensource.org/licenses/MIT)
