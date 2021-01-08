
const nav = {
  title: '开发相关',
  nav: [
    {
      title: '开发神器',
      nav: [
        {
          icon: 'https://avatars2.githubusercontent.com/u/7366472?s=200&v=4',
          name: 'tldr',
          desc: '控制台命令的协作备忘单',
          url: 'https://github.com/tldr-pages/tldr',
        },
        {
          name: 'Tutor',
          desc: '可视化Python，Java，JavaScript，C，C ++，Ruby代码执行过程',
          url: 'http://www.pythontutor.com/visualize.html#mode=edit',
        },
        {
          name: 'EverSQL',
          desc: '人工智能驱动的SQL查询优化和性能瓶颈预测',
          url: 'https://www.eversql.com/',
        },
        {
          name: 'releasly',
          desc: '在新的开源版本发布时收到通知，直接发送到您的电子邮件中。',
          url: 'https://www.releasly.co/',
        },
        {
          name: 'Convert cURL',
          desc: '将curl命令转换为Python，JavaScript，PHP，R，Go，Rust，Dart，JSON，Ansible，Elixir。',
          url: 'https://curl.trillworks.com/',
          language: [
            '',
            '',
            'https://github.com/NickCarneiro/curlconverter'
          ]
        },
        {
          name: 'Supervisor',
          desc: 'Supervisor是一个客户端/服务器系统，允许其用户监视和控制类似UNIX的操作系统上的多个进程。',
          url: 'http://supervisord.org/',
        },
        {
          icon: 'https://www.sonarqube.org/favicon-152.png',
          name: 'SonarQube',
          desc: '代码质量和安全性检查, 支持所有开发人员编写更干净，更安全的代码。',
          url: 'https://www.sonarqube.org/',
        },
        {
          icon: 'https://paste.ubuntu.com/favicon.ico',
          name: 'Pastebin',
          desc: '在线共享代码，将代码以URL形式发送以便查看',
          url: 'https://paste.ubuntu.com/',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/30217756?s=200&v=4',
          name: 'UPX',
          desc: 'UPX-可执行文件的终极打包器',
          url: 'https://github.com/upx/upx',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/30217756?s=200&v=4',
          name: 'askgit',
          desc: '使用SQL查询git存储库。生成报告，执行状态检查，分析代码库。',
          url: 'https://github.com/augmentable-dev/askgit',
        },
        {
          icon: 'https://avatars3.githubusercontent.com/u/1396951?s=200&v=4',
          name: 'Sentry',
          desc: 'Web应用程序，移动应用程序和游戏的实时崩溃报告。',
          url: 'https://sentry.io/',
          language: [
            '',
            '',
            'https://github.com/getsentry'
          ]
        },
        {
          icon: 'https://randomuser.me/favicon.ico',
          name: 'randomuser',
          desc: '随机用户生成器是用于生成占位符用户信息的免费API。 获取个人资料照片，姓名等。 对于人们来说，就像Lorem Ipsum。',
          url: 'https://randomuser.me/',
        },
        {
          icon: 'https://camo.githubusercontent.com/ebfdd465daa90626d0ab0d0fddc0e457c942a392/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f616e7572616768617a72612f696d6167652f75706c6f61642f76313539343930383234322f6c6f676f5f636373776d652e737667',
          name: 'github-readme-stats',
          desc: '在你的 README 中 获取动态生成的 GitHub 统计信息',
          url: 'https://github.com/anuraghazra/github-readme-stats/blob/master/readme_cn.md',
        },
        {
          icon: 'https://i.imgur.com/zBEQq4w.png',
          name: 'Hits',
          desc: '了解有多少人正在查看您的GitHub项目的简单方法',
          url: 'http://hits.dwyl.io/',
        },
        {
          name: 'GitHub 文件加速',
          desc: 'GitHub 文件加速',
          url: 'https://shrill-pond-3e81.hunsh.workers.dev/',
        },
        {
          name: 'Shields IO',
          desc: 'svg生成版本号图标',
          url: 'https://shields.io/',
        },
        {
          icon: 'https://www.fundebug.com/favicon.ico',
          name: 'FunDebug',
          desc: '支持前端JavaScript，后端Node.js以及微信小程序错误监控',
          url: 'https://www.fundebug.com/',
        },
        {
          icon: 'http://www.asciiworld.com/favicon.ico',
          name: 'Asciiworld',
          desc: 'WA！原来那些年程序猿搞怪的注释都在这里',
          url: 'http://www.asciiworld.com/',
        },
        {
          icon: 'https://jsfiddle.net/img/favicon.png',
          name: 'jsfiddle',
          desc: '强大的前端代码在线演示的网站',
          url: 'http://jsfiddle.net/',
        },
        {
          icon: 'https://user-images.githubusercontent.com/799578/50462941-8075fe80-09c3-11e9-89e7-af0cb7991406.png',
          name: 'CODEIF',
          desc: '变量命名神器',
          url: 'https://unbug.github.io/codelf/',
        },
        {
          icon: 'http://asciiflow.com/images/favicon.png',
          name: 'ASCIIFlow Infinity',
          desc: '无限的ASCII图表，保存到谷歌驱动器，调整大小，自由绘制，并直接输出到文本/HTML。',
          url: 'http://asciiflow.com/',
        },
        {
          icon: 'https://kinolien.github.io/gitzip/images/gitzip.png',
          name: 'gitzip',
          desc: '它可以将GITHUB存储库的子文件夹/子目录作为zip并下载',
          url: 'https://kinolien.github.io/gitzip/',
        },
        {
          icon: 'http://sc.ftqq.com/static/image/favlogo.png',
          name: 'Server酱',
          desc: '「Server酱」，英文名「ServerChan」，是一款「程序员」和「服务器」之间的通信软件。',
          url: 'http://sc.ftqq.com',
        },
        {
          name: 'mkcert',
          desc: '一个简单的零配置工具，可以使用您喜欢的任何名称制作本地可信赖的SSL开发证书',
          url: 'https://github.com/FiloSottile/mkcert',
        },
        {
          icon: 'https://carbon.now.sh/favicon.ico',
          name: 'carbon',
          desc: '创建和分享源代码的精美图像',
          url: 'https://carbon.now.sh',
          language: [
            '',
            '',
            'https://github.com/dawnlabs/carbon'
          ]
        },
        {
          name: 'setup-ipsec-vpn',
          desc: '用于构建您自己的IPsec VPN服务器的脚本，在Ubuntu，Debian和CentOS上使用IPsec / L2TP和Cisco IPsec',
          url: 'https://github.com/hwdsl2/setup-ipsec-vpn',
        },
        {
          icon: 'https://www.digitalocean.com/favicon.ico',
          name: 'nginxconfig',
          desc: 'nginx配置生成器',
          url: 'https://www.digitalocean.com/community/tools/nginx#?',
          language: [
            '',
            '',
            'https://github.com/digitalocean/nginxconfig.io'
          ]
        },
        {
          name: 'GraphQL Explorer',
          desc: 'GraphQL资源管理器利用真实的、实时的生产数据',
          url: 'https://developer.github.com/v4/explorer/',
        },
        {
          name: 'patorjk',
          desc: '将文本转换成ASCII',
          url: 'http://patorjk.com/software/taag/#p=display&f=Graffiti&t=xiejiahe',
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/62133242?s=200&v=4',
          name: 'lens',
          desc: 'Lens控制Kubernetes集群所需的唯一IDE。它是适用于MacOS，Windows和Linux操作系统的独立应用程序。它是开源的，免费的。',
          url: 'https://k8slens.dev/',
          language: [
            '',
            '',
            'https://github.com/lensapp/lens'
          ]
        },
        {
          name: 'public-apis',
          desc: '一些可用在 Web 或软件开发的开放 API 接口',
          url: 'https://github.com/public-apis/public-apis',
        },
        {
          icon: 'https://astexplorer.net/favicon.png',
          name: 'astexplorer',
          desc: '一个Web工具，用于探索由各种解析器生成的AST',
          url: 'https://astexplorer.net/',
          language: [
            '',
            '',
            'https://github.com/fkling/astexplorer'
          ]
        },
        {
          icon: 'http://www.u.tools/assets/img/brand/favicon.png',
          name: 'uTools',
          desc: 'uTools是一个极简、插件化、跨平台的现代桌面软件。通过自由选配丰富的插件，打造你得心应手的工具集合',
          url: 'http://www.u.tools/',
        },
        {
          icon: 'https://ihateregex.io/favicon.ico',
          name: 'ihateregex',
          desc: '正则表达式备忘录',
          url: 'https://ihateregex.io/',
        },
        {
          icon: 'https://avatars3.githubusercontent.com/u/22552083?s=200&v=4',
          name: 'Oh My ZSH',
          desc: '是一个开放源代码，社区驱动的框架，用于管理zsh配置。',
          url: 'https://ohmyz.sh/',
          language: [
            '',
            '',
            'https://github.com/ohmyzsh'
          ]
        },
        {
          icon: 'https://tampermonkey.freetls.fastly.net/images/icon144.png',
          name: 'Tampermonkey',
          desc: '一款免费的浏览器扩展和最为流行的用户脚本管理器',
          url: 'https://www.tampermonkey.net/',
        },
        {
          name: 'Greasy Fork',
          desc: '提供用户脚本的网站',
          url: 'https://greasyfork.org/zh-CN',
        },
        {
          icon: 'https://img.kuaidaili.com/img/favicon.ico?v=3',
          name: '免费代理',
          desc: '免费HTTP代理IP',
          url: 'https://www.kuaidaili.com/free/inha/1/',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/1342004?s=200&v=4',
          name: 'Google Workspace',
          desc: 'Google Workspace状态信息中心',
          url: 'https://www.google.com/appsstatus#hl=en&v=status',
        },
        {
          name: 'isometric-contributions',
          desc: '浏览器扩展，用于渲染GitHub贡献图的等距像素艺术版本。',
          url: 'https://github.com/jasonlong/isometric-contributions',
        },
      ]
    },
    {
      title: '接口/开发文档管理',
      nav: [
        {
          icon: 'https://www.eolinker.com/assets/images/favicon.ico',
          name: 'eoLinker接口管理平台',
          desc: '国内最大的在线接口管理服务方案供应商',
          url: 'https://www.eolinker.com/',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/19645609?s=200&v=4',
          name: 'YApi',
          desc: 'YApi 是一个可本地部署的、打通前后端及QA的、可视化的接口管理平台',
          url: 'https://yapi.baidu.com/',
          language: [
            '',
            '',
            'https://github.com/YMFE/yapi'
          ]
        },
        {
          icon: 'http://rap2.taobao.org/favicon.png',
          name: 'RAP2',
          desc: 'Web接口管理工具，开源免费，接口自动化，MOCK数据自动生成，自动化测试，企业级管理。阿里妈妈MUX团队出品',
          url: 'http://rap2.taobao.org/',
          language: [
            '',
            '',
            'https://github.com/thx/rap2-delos'
          ]
        },
        {
          icon: 'https://www.showdoc.cc/static/logo/b_64.png',
          name: 'showdoc',
          desc: '一个非常适合IT团队的在线API文档、技术文档工具',
          url: 'https://www.showdoc.cc/',
          language: [
            '',
            '',
            'https://github.com/star7th/showdoc'
          ]
        },
        {
          icon: 'https://avatars3.githubusercontent.com/u/40133106?s=200&v=4',
          name: 'docsify',
          desc: '一个神奇的文档站点生成器',
          url: 'https://docsify.js.org',
          language: [
            '',
            '',
            'https://github.com/docsifyjs/docsify'
          ]
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/4103663?s=200&v=4',
          name: 'apiDoc',
          desc: 'RESTful Web API文档生成器',
          url: 'http://apidocjs.com',
          language: [
            '',
            '',
            'https://github.com/apidoc/apidoc'
          ]
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/69631?s=200&v=4',
          name: 'docusaurus',
          desc: '易于维护的开源文档网站',
          url: 'https://docusaurus.io/',
          language: [
            '',
            '',
            'https://github.com/facebook/docusaurus'
          ]
        },
        {
          icon: 'https://www.zentao.net/favicon.ico',
          name: '禅道',
          desc: '禅道是灵活的项目管理软件',
          url: 'https://www.zentao.net/',
        },
        {
          icon: 'https://www.tapd.cn/favicon.ico',
          name: 'Tapd',
          desc: '一站式敏捷研发协作云平台, 凝聚腾讯研发方法及敏捷实践精髓, 助力企业研发更高效、协作更敏捷',
          url: 'https://www.tapd.cn/',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/56705483?s=200&v=4',
          name: 'Hoppscotch',
          desc: '一个免费，快速，美观的API请求构建器，供10万多个开发人员使用。(原名叫 Postwoman)',
          url: 'https://hoppscotch.io/',
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/22632046?s=200&v=4',
          name: 'storybook',
          desc: 'UI组件浏览器。为React，Vue，Angular，Ember，Web Components等开发，记录和测试！',
          url: 'https://storybook.js.org/',
          language: [
            '',
            '',
            'https://github.com/storybookjs/storybook'
          ]
        },
      ]
    },
    {
      title: '内网穿透/代理',
      nav: [
        {
          name: 'Sunny-Ngrok',
          desc: '一条命令解决的外网访问内网问题，无需任何配置，下载客户端之后直接一条命令让外网访问您的内网不再是距离',
          url: 'https://www.ngrok.cc/',
        },
        {
          name: 'frp',
          desc: '一个快速反向代理，可帮助您将NAT或防火墙后面的本地服务器暴露给Internet。',
          url: 'https://github.com/fatedier/frp',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/11404085?s=200&v=4',
          name: 'zan-proxy',
          desc: '本地代码调试线上页面，环境再也不是问题',
          url: 'https://youzan.github.io/zan-proxy/',
          language: [
            '',
            '',
            'https://github.com/youzan/zan-proxy'
          ]
        },
        {
          icon: 'https://ngrok.com/static/img/favicon.png',
          name: 'ngrok',
          desc: 'ngrok是一个反向代理，通过在公共的端点和本地运行的 Web 服务器之间建立一个安全的通道。ngrok可捕获和分析所有通道上的流量，便于后期分析和重放',
          url: 'https://ngrok.com/',
          language: [
            '',
            '',
            'https://github.com/inconshreveable/ngrok'
          ]
        },
      ]
    },
    {
      title: '编码/解码',
      nav: [
        {
          icon: 'http://www.chamd5.org/favicon.ico',
          name: '查MD5',
          desc: 'MD5在线解密|md5在线破解|批量破解md5网站',
          url: 'http://www.cmd5.com/',
        },
        {
          icon: 'https://jwt.io/img/favicon/apple-icon-76x76.png',
          name: 'JSON Web Tokens',
          desc: 'jwt 在线解码',
          url: 'https://jwt.io/',
        },
        {
          icon: 'http://www.xpcha.com/favicon.ico',
          name: 'base64',
          desc: 'base64在线解码编码',
          url: 'http://base64.xpcha.com/',
        },
      ]
    },
    {
      title: '免费公开API',
      nav: [
        {
          icon: 'https://www.ipify.org/static/images/favicon-96x96.png',
          name: 'ipify',
          desc: '一个简单的公共IP地址API',
          url: 'https://www.ipify.org/',
        },
        {
          name: '归属地查询',
          desc: '淘宝免费归属地查询',
          url: 'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=13333333333',
        },
      ]
    },
  ]
};

export default nav;
