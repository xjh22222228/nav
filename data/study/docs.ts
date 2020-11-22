
const thisYear = new Date().getFullYear();

export default {
  title: '参考文档',
  nav: [
    {
      title: 'Docker',
      nav: [
        {
          icon: 'https://github.com/favicon.ico',
          name: 'Docker — 从入门到实践',
          desc: 'Docker — 从入门到实践',
          url: 'https://yeasy.gitbooks.io/docker_practice/',
        },
        {
          icon: 'https://github.com/favicon.ico',
          name: 'Docker官方映像文档',
          desc: 'docker-library中的Docker官方映像文档',
          url: 'https://github.com/docker-library/docs',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/7739233?s=200&v=4',
          name: 'Docker Hub',
          desc: 'Docker 镜像仓库',
          url: 'https://hub.docker.com/',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/7739233?s=200&v=4',
          name: 'Docker-Compose',
          desc: '使用Docker定义和运行多容器应用程序',
          url: 'https://docs.docker.com/compose/',
          language: [
            '',
            '',
            'https://github.com/docker/compose'
          ]
        },
      ]
    },
    {
      title: 'Git',
      nav: [
        {
          icon: 'https://github.com/favicon.ico',
          name: 'git-manual',
          desc: 'Git常用命令参考手册 (推荐学习)',
          url: 'https://github.com/xjh22222228/git-manual',
        },
        {
          icon: 'https://github.com/favicon.ico',
          name: 'GitHub Docs',
          desc: 'github 官方帮助文档',
          url: 'https://help.github.com/cn',
        },
        {
          icon: 'https://github.com/favicon.ico',
          name: 'awesome-actions',
          desc: '精选的GitHub上很棒的Action列表',
          url: 'https://github.com/sdras/awesome-actions',
        },
        {
          icon: 'https://github.com/favicon.ico',
          name: 'Github - Actions',
          desc: 'Github 官方Actions 资源列表',
          url: 'https://github.com/marketplace?type=actions',
        },
        {
          icon: 'https://github.com/favicon.ico',
          name: 'growing-up',
          desc: '程序猿成长计划',
          url: 'https://github.com/mylxsw/growing-up',
        },
      ]
    },
    {
      title: '服务器',
      nav: [
        {
          icon: 'https://avatars0.githubusercontent.com/u/1412239?s=200&v=4',
          name: 'nginx',
          desc: 'nginx参考文档',
          url: 'https://www.docs4dev.com/docs/zh/nginx/current/reference#toolbar-title',
          language: [
            'http://nginx.org/en/docs/',
            'https://www.docs4dev.com/docs/zh/nginx/current/reference#toolbar-title',
            'https://github.com/nginx/nginx'
          ]
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/1412239?s=200&v=4',
          name: 'Nginx开发从入门到精通',
          desc: 'Nginx开发从入门到精通',
          url: 'http://tengine.taobao.org/book/index.html',
          language: [
            '',
            '',
            'https://github.com/taobao/nginx-book'
          ]
        },
      ]
    },
    {
      title: '数据库',
      nav: [
        {
          icon: 'https://avatars3.githubusercontent.com/u/1529926?s=200&v=4',
          name: 'redis',
          desc: 'Redis 是一个开源（BSD许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件。 它支持多种类型的数据结构',
          url: 'http://www.redis.cn/',
          language: [
            'https://redis.io/',
            'http://www.redis.cn/',
            'https://github.com/redis/redis'
          ]
        },
        {
          icon: 'https://labs.mysql.com/common/themes/sakila/favicon.ico',
          name: 'MySQL',
          desc: 'MySQL数据库服务是一个完全托管的数据库服务，可使用世界上最受欢迎的开源数据库来部署云原生应用程序。 它是百分百由MySQL原厂开发，管理和提供支持',
          url: 'https://www.mysql.com/cn/',
        },
      ]
    },
    {
      title: '书籍',
      nav: [
        {
          icon: 'https://avatars1.githubusercontent.com/u/14127308?s=200&v=4',
          name: '免费的编程中文书籍索引',
          desc: '免费的编程中文书籍索引',
          url: 'https://github.com/EbookFoundation/free-programming-books/blob/master/free-programming-books-zh.md',
        },
        {
          icon: 'https://zh.b-ok.global/apple-touch-icon.png',
          name: 'Zlibrary',
          desc: 'Z-Library 项目部分. 全球最大的数字图书馆, 电子书',
          url: 'https://zh.b-ok.global/',
        },
        {
          name: 'IT-eBOOK',
          desc: 'IT类技术书籍PDF',
          url: 'https://github.com/asyncfun/IT-eBOOK',
        },
        {
          icon: 'https://refactoringguru.cn/favicon.ico',
          name: 'Refactoring.Guru',
          desc: '22种常用设计模式',
          url: 'https://refactoringguru.cn/design-patterns',
        },
      ]
    },
    {
      title: '其他文档',
      nav: [
        {
          icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/linux/linux.png',
          name: 'Linux 常用命令参考手册',
          desc: 'Linux 常用命令参考手册',
          url: 'https://github.com/xjh22222228/linux-manual',
        },
        {
          icon: 'https://github.com/favicon.ico',
          name: 'developer-roadmap',
          desc: `${thisYear}年成为网络开发人员的路线图`,
          url: 'https://github.com/kamranahmedse/developer-roadmap',
        },
        {
          icon: 'https://devhints.io/assets/favicon.png',
          name: 'Devhints',
          desc: 'WEB开发速查表，mysql/go/java/js/bash/react/git...',
          url: 'https://devhints.io/',
        },
        {
          icon: 'https://wangchujiang.com/linux-command/img/favicon.ico',
          name: 'linux-command',
          desc: 'Linux命令大全搜索工具，内容包含Linux命令手册、详解、学习、搜集',
          url: 'https://git.io/linux',
          language: [
            '',
            '',
            'https://github.com/jaywcjlove/linux-command'
          ]
        },
        {
          icon: 'https://github.com/favicon.ico',
          name: 'learn-regex',
          desc: '正则表达式学习',
          url: 'https://github.com/ziishaned/learn-regex',
        },
        {
          icon: 'https://github.com/favicon.ico',
          name: 'the-art-of-command-line',
          desc: '命令行的艺术',
          url: 'https://github.com/jlevy/the-art-of-command-line/blob/master/README-zh.md',
        },
        {
          icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/chrome/chrome.png',
          name: 'Peter Beverloo',
          desc: 'Chrome浏览器命令参数参考手册',
          url: 'https://peter.sh/experiments/chromium-command-line-switches/',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/11618545?s=200&v=4',
          name: 'vimrc',
          desc: 'vim配置参考手册',
          url: 'https://github.com/amix/vimrc',
        },
        {
          icon: 'https://www.jenkins.io/zh/sites/default/files/jenkins_favicon.ico',
          name: 'Jenkins',
          desc: 'Jenkins是开源CI&CD软件领导者， 提供超过1000个插件来支持构建、部署、自动化， 满足任何项目的需要',
          url: 'https://www.jenkins.io/zh/',
        },
        {
          icon: 'https://learnxinyminutes.com/favicon.ico',
          name: 'learnxinyminutes-docs',
          desc: '在Y分钟内学习X',
          url: 'https://learnxinyminutes.com/',
        },
        {
          icon: 'https://code.visualstudio.com/apple-touch-icon.png',
          name: 'Vscode Docs',
          desc: 'Vscode 扩展开发文档',
          url: 'https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/',
          language: [
            'https://code.visualstudio.com/api',
            'https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/',
            'https://github.com/microsoft/vscode-docs'
          ]
        },
        {
          name: 'YAML教程',
          desc: 'YAML教程',
          url: 'https://www.yiibai.com/yaml',
        },
        {
          icon: 'https://www.google.com/images/icons/product/chrome-32.png',
          name: 'Chrome Extension',
          desc: '谷歌浏览器扩展插件开发文档',
          url: 'https://developer.chrome.com/extensions',
        },
      ]
    },
  ]
}
