
export default {
  title: '依赖包',
  icon: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png',
  nav: [
    {
      title: '网络请求',
      nav: [
        {
          name: 'request',
          desc: '简化的HTTP请求客户端',
          url: 'https://github.com/request/request',
        },
        {
          name: 'superagent',
          desc: '一个小型渐进式客户端HTTP请求库，Node.js模块具有相同的API，具有许多高级HTTP客户端功能',
          url: 'http://visionmedia.github.io/superagent/',
          language: [
            '',
            '',
            'https://github.com/visionmedia/superagent'
          ]
        },
        {
          name: 'axios',
          desc: '基于Promise的HTTP客户端，用于浏览器和node.js',
          url: 'https://github.com/axios/axios',
        },
        {
          name: 'node-fetch',
          desc: '一个轻量级的模块，将window.fetch带到Node.js',
          url: 'https://github.com/node-fetch/node-fetch',
        },
        {
          name: 'bent',
          desc: '带有async await的功能性JS HTTP客户端（Node.js和Fetch）',
          url: 'https://github.com/mikeal/bent',
        },
        {
          name: 'superagent-proxy',
          desc: 'superagent代理扩展，这使您可以通过某种代理来代理HTTP请求',
          url: 'https://github.com/TooTallNate/superagent-proxy',
        },
      ]
    },
    {
      title: '单元测试',
      nav: [
        {
          icon: 'https://pptr.dev/favicons/apple-touch-icon.png',
          name: 'Puppeteer',
          desc: 'Puppeteer是一个Node库，它提供了一个高级API来通过DevTools协议控制Chromium或Chrome',
          url: 'https://pptr.dev/',
          language: [
            'https://pptr.dev/',
            'https://zhaoqize.github.io/puppeteer-api-zh_CN/',
            'https://github.com/GoogleChrome/puppeteer'
          ]
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/8908513?s=200&v=4',
          name: 'cypress',
          desc: '对浏览器中运行的所有内容进行快速，轻松和可靠的测试，（类Puppeteer）',
          url: 'https://www.cypress.io/',
          language: [
            '',
            '',
            'https://github.com/cypress-io/cypress'
          ]
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/8770005?s=200&v=4',
          name: 'Mocha',
          desc: 'Node.js和浏览器的简单，灵活，有趣的JavaScript测试框架',
          url: 'https://mochajs.org/',
          language: [
            '',
            '',
            'https://github.com/mochajs/mocha'
          ]
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/1515293?s=200&v=4',
          name: 'chai',
          desc: 'node.js的BDD/TDD断言框架和可以与任何测试框架配对的浏览器',
          url: 'http://www.chaijs.com/',
          language: [
            '',
            '',
            'https://github.com/chaijs/chai'
          ]
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/8527916?s=200&v=4',
          name: 'ava',
          desc: '未来的JavaScript测试运行器',
          url: 'https://github.com/avajs/ava',
          language: [
            '',
            'https://github.com/avajs/ava-docs/blob/master/zh_CN/readme.md',
          ]
        },
        {
          icon: 'https://jestjs.io/img/favicon/favicon.ico',
          name: 'Jest',
          desc: 'Jest是一个令人愉快的JavaScript测试框架，专注于简单性。',
          url: 'https://jestjs.io/zh-Hans/',
          language: [
            '',
            '',
            'https://github.com/facebook/jest',
          ]
        },
        {
          icon: 'https://avatars1.githubusercontent.com/u/4243232?s=200&v=4',
          name: 'testcafe',
          desc: '一个Node.js工具，用于自动化端到端Web测试',
          url: 'https://devexpress.github.io/testcafe/',
          language: [
            '',
            '',
            'https://github.com/DevExpress/testcafe',
          ]
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/26206404?s=200&v=4',
          name: 'jest-puppeteer',
          desc: '使用Jest＆Puppeteer运行测试 🎪✨',
          url: 'https://github.com/smooth-code/jest-puppeteer'
        },
        {
          icon: 'https://kulshekhar.github.io/ts-jest/assets/img/logo.png',
          name: 'ts-jest',
          desc: '具有对Jest的Sourcemap支持的TypeScript预处理器',
          url: 'https://kulshekhar.github.io/ts-jest',
          language: [
            '',
            '',
            'https://github.com/kulshekhar/ts-jest',
          ]
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/26206404?s=200&v=4',
          name: 'jest-extended',
          desc: '扩展 jest 匹配器',
          url: 'https://github.com/jest-community/jest-extended',
        },
      ]
    },
    {
      title: '数据库',
      nav: [
        {
          name: 'node-mysql2',
          desc: 'node.js的快速node-mysql兼容的mysql驱动程序',
          url: 'https://github.com/sidorares/node-mysql2',
        },
        {
          name: 'sequelize',
          desc: '基于 promise 的 Node.js ORM, 目前支持 Postgres, MySQL, SQLite 和 Microsoft SQL Server. 它具有强大的事务支持, 关联关系, 读取和复制等功能',
          url: 'https://demopark.github.io/sequelize-docs-Zh-CN/',
          language: [
            'http://docs.sequelizejs.com/',
            'https://demopark.github.io/sequelize-docs-Zh-CN/',
            'https://github.com/sequelize/sequelize'
          ]
        },
        {
          name: 'mongoose',
          desc: 'mongodb对象模型设计用于在异步环境中工作。',
          url: 'http://www.mongoosejs.net/',
          language: [
            'http://mongoosejs.com/',
            'http://www.mongoosejs.net/',
            'https://github.com/Automattic/mongoose'
          ]
        },
        {
          name: 'ioredis',
          desc: '适用于Node.js，以性能为中心且功能齐全的Redis客户端。',
          url: 'https://github.com/luin/ioredis',
        },
        {
          name: 'objection.js',
          desc: 'Objection.js是Node.js的一个ORM ，它旨在避免使用SQL和底层数据库引擎的全部功能，同时尽可能简单地将magic保持在最低限度。',
          url: 'http://vincit.github.io/objection.js/',
          language: [
            '',
            '',
            'https://github.com/Vincit/objection.js'
          ]
        },
        {
          name: 'nedb',
          desc: 'JavaScript数据库，用于Node.js，nw.js，electron和浏览器',
          url: 'https://github.com/louischatriot/nedb',
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/20165699?s=200&v=4',
          name: 'typeorm',
          desc: 'ORM for TypeScript和JavaScript（ES7，ES6，ES5）。支持MySQL，PostgreSQL，MariaDB，SQLite，MS SQL Server，Oracle，WebSQL数据库。适用于NodeJS，浏览器，Ionic，Cordova和Electron平台',
          url: 'http://typeorm.io',
          language: [
            '',
            'https://github.com/typeorm/typeorm/tree/master/docs/zh_CN',
            'https://github.com/typeorm/typeorm'
          ]
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/10490573?s=200&v=4',
          name: 'knexjs',
          desc: 'PostgreSQL，MySQL和SQLite3的查询构建器，旨在灵活，可移植且易于使用。',
          url: 'http://knexjs.org',
          language: [
            '',
            '',
            'https://github.com/knex/knex'
          ]
        },
        {
          icon: 'https://avatars1.githubusercontent.com/u/5845577?s=200&v=4',
          name: 'node-redis',
          desc: '高性能Node.js Redis客户端。',
          url: 'https://github.com/NodeRedis/node-redis',
        },
      ]
    },
    {
      title: '图形相关',
      nav: [
        {
          name: 'node-canvas',
          desc: 'node-canvas是Node.js的Cairo -backed Canvas实现。',
          url: 'https://github.com/Automattic/node-canvas',
        },
        {
          name: 'svg-captcha',
          desc: '在node.js中生成svg验证码',
          url: 'https://github.com/lemonce/svg-captcha',
        },
        {
          name: 'ccap',
          desc: 'node.js使用C++库CImg生成验证码，无需安装任何其他库或软件',
          url: 'https://github.com/DoubleSpout/ccap',
        },
        {
          name: 'text-to-svg',
          desc: '将文本转换为SVG路径而不依赖于本机',
          url: 'https://github.com/shrhdk/text-to-svg',
        },
        {
          name: 'svg2png',
          desc: '使用PhantomJS将SVG转换为PNG',
          url: 'https://github.com/domenic/svg2png',
        },
      ]
    },
    {
      title: '代理',
      nav: [
        {
          name: 'node-http-proxy',
          desc: '一个HTTP可编程代理库，支持websocket。它适用于实现反向代理和负载平衡器等组件',
          url: 'https://github.com/nodejitsu/node-http-proxy',
        },
        {
          name: 'http-proxy-middleware',
          desc: '用于连接，快速和浏览器同步的单线程node.js http-proxy中间件（基于node-http-proxy）',
          url: 'https://github.com/chimurai/http-proxy-middleware',
        },
      ]
    },
    {
      title: 'AST辅助工具',
      nav: [
        {
          name: 'esprima',
          desc: 'ECMAScript解析基础架构，可进行多用途分析, 将代码转换成AST',
          url: 'https://esprima.org/',
          language: [
            '',
            '',
            'https://github.com/jquery/esprima'
          ]
        },
        {
          name: 'recast',
          desc: 'JavaScript AST转换器，非破坏性漂亮打印机和自动源映射生成器',
          url: 'https://github.com/benjamn/recast',
        },
      ]
    },
    {
      title: '文件相关',
      nav: [
        {
          name: 'node-xlsx',
          desc: 'NodeJS excel文件解析器和构建器',
          url: 'https://github.com/mgcrea/node-xlsx',
        },
        {
          name: 'fs-extra',
          desc: '操作系统文件，用于替代内置的fs模块',
          url: 'https://www.xiejiahe.com/detail/5b52fca1df53a14006035e1e',
          language: [
            '',
            'https://www.xiejiahe.com/detail/5b52fca1df53a14006035e1e',
            'https://github.com/jprichardson/node-fs-extra'
          ]
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/5826089?s=200&v=4',
          name: 'js-xlsx',
          desc: 'SheetJS社区版 - 电子表格工具包',
          url: 'https://sheetjs.com/',
          language: [
            '',
            '',
            'https://github.com/SheetJS/js-xlsx'
          ]
        },
        {
          icon: 'https://www.archiverjs.com/images/logo.svg',
          name: 'node-archiver',
          desc: '文件压缩',
          url: 'https://www.archiverjs.com/',
          language: [
            '',
            '',
            'https://github.com/archiverjs/node-archiver'
          ]
        },
      ]
    },
    {
      title: '微信开发',
      nav: [
        {
          name: 'wechat-oauth',
          desc: '微信公共平台OAuth接口消息接口服务中间件与API SDK',
          url: 'https://github.com/node-webot/wechat-oauth',
        },
        {
          name: 'wechat-api',
          desc: '微信公共平台API',
          url: 'https://github.com/node-webot/wechat-api',
        },
        {
          name: 'wechat',
          desc: '微信公共平台消息接口服务中间件',
          url: 'https://github.com/node-webot/wechat',
        },
        {
          name: 'wechaty',
          desc: '是适用于微信个人帐户的Bot SDK ，可以帮助您创建6行javascript的机器人',
          url: 'https://chatie.io/wechaty/',
          language: [
            '',
            '',
            'https://github.com/Chatie/wechaty'
          ]
        },
      ]
    },
    {
      title: 'CLI',
      nav: [
        {
          name: 'Glob',
          desc: '匹配文件。 **/*.js',
          url: 'https://github.com/isaacs/node-glob',
        },
        {
          name: 'prompts',
          desc: '轻巧，美观和用户友好的交互式提示',
          url: 'https://github.com/terkelg/prompts',
        },
        {
          icon: 'https://avatars3.githubusercontent.com/u/21160645?s=200&v=4',
          name: 'enquirer',
          desc: '时尚，直观和用户友好的提示',
          url: 'https://github.com/enquirer/enquirer',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/887802?s=200&v=4',
          name: 'cli-table3',
          desc: '带有Node.JS的CLI的漂亮unicode表',
          url: 'https://github.com/cli-table/cli-table3',
        },
        {
          name: 'commander.js',
          desc: 'node.js命令行界面的完整解决方案，受Ruby指挥官的启发',
          url: 'https://github.com/tj/commander.js',
        },
        {
          name: 'ora',
          desc: '优雅的终端微调器',
          url: 'https://github.com/sindresorhus/ora',
        },
        {
          name: 'Inquirer.js',
          desc: '常用交互式命令行用户界面的集合',
          url: 'https://github.com/SBoudrias/Inquirer.js',
        },
        {
          name: 'shelljs',
          desc: 'Node.js的可移植Unix shell命令',
          url: 'https://documentup.com/shelljs/shelljs',
          language: [
            '',
            '',
            'https://github.com/shelljs/shelljs'
          ]
        },
        {
          name: 'download-git-repo',
          desc: '下载并提取git存储库（GitHub，GitLab，Bitbucket）',
          url: 'https://github.com/flipxfx/download-git-repo'
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/6078720?s=200&v=4',
          name: 'node-semver',
          desc: 'node的semver解析器',
          url: 'https://github.com/npm/node-semver'
        },
        {
          name: 'node-progress',
          desc: 'node.js的灵活ascii进度条',
          url: 'https://github.com/visionmedia/node-progress'
        },
        {
          name: 'node-qrcode',
          desc: '二维码生成',
          url: 'https://github.com/soldair/node-qrcode'
        },
        {
          name: 'open',
          desc: '打开URL，文件，可执行文件等内容。跨平台。',
          url: 'https://github.com/sindresorhus/open',
        },
        {
          name: 'ssh2',
          desc: '用纯JavaScript编写的SSH2客户端和服务器模块，用于node.js',
          url: 'https://github.com/mscdex/ssh2',
        },
        {
          name: 'minimist',
          desc: '解析参数选项',
          url: 'https://github.com/substack/minimist',
        },
        {
          name: 'node-clear',
          desc: '清空终端屏幕信息',
          url: 'https://github.com/bahamas10/node-clear',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/13122722?s=200&v=4',
          name: 'chalk',
          desc: '终端字符串样式',
          url: 'https://github.com/chalk/chalk',
        },
        {
          icon: 'https://avatars3.githubusercontent.com/u/16504989?s=200&v=4',
          name: 'yargs',
          desc: '通过解析参数并生成优雅的用户界面来帮助您构建交互式命令行工具。',
          url: 'https://github.com/yargs/yargs',
        },
      ]
    },
    {
      title: '模板引擎',
      nav: [
        {
          icon: 'https://handlebarsjs.com/images/favicon.png',
          name: 'handlebars',
          desc: 'JavaScript模板引擎',
          url: 'http://handlebarsjs.com/',
          language: [
            '',
            '',
            'https://github.com/wycats/handlebars.js'
          ]
        },
        {
          icon: 'https://ejs.co/favicon.svg',
          name: 'ejs',
          desc: 'JavaScript模板引擎',
          url: 'https://ejs.co/',
          language: [
            '',
            '',
            'https://github.com/mde/ejs'
          ]
        },
        {
          icon: 'https://github.githubassets.com/favicons/favicon.svg',
          name: 'mustache.js',
          desc: '使用JavaScript的无逻辑{{mustache}}模板',
          url: 'https://github.com/janl/mustache.js',
        },
      ]
    },
    {
      title: '其他',
      nav: [
        {
          name: 'node-xml2js',
          desc: '简单的XML到JavaScript对象转换器。它支持双向转换。使用sax-js和 xmlbuilder-js',
          url: 'https://github.com/Leonidas-from-XIV/node-xml2js',
        },
        {
          name: 'iconv-lite',
          desc: '纯JavaScript中转换字符编码。',
          url: 'https://github.com/ashtuchkin/iconv-lite',
        },
        {
          name: 'node-uuid',
          desc: '在JavaScript中生成符合RFC的UUID',
          url: 'https://github.com/kelektiv/node-uuid',
        },
        {
          name: 'nativefier',
          desc: '使任何网页成为桌面应用程序',
          url: 'https://github.com/jiahaog/nativefier',
        },
        {
          name: 'getmac',
          desc: '通过Node.js获取当前计算机的mac地址',
          url: 'https://github.com/bevry/getmac',
        },
        {
          name: 'http-server',
          desc: '一个简单的零配置命令行http服务器',
          url: 'https://github.com/indexzero/http-server',
        },
        {
          name: 'node-schedule',
          desc: 'Node的类似cron-like和非not-cron-like的作业调度程序。',
          url: 'https://github.com/node-schedule/node-schedule',
        },
        {
          name: 'qrcode-terminal',
          desc: 'QRCode终端版',
          url: 'https://github.com/gtanner/qrcode-terminal',
        },
        {
          icon: 'https://avatars1.githubusercontent.com/u/13612933?s=200&v=4',
          name: 'localtunnel',
          desc: 'localtunnel将您的localhost暴露给世界，以便于测试和共享！无需混淆DNS或部署只是为了让其他人测试您的更改',
          url: 'https://localtunnel.github.io/www/',
          language: [
            '',
            '',
            'https://github.com/localtunnel/localtunnel'
          ]
        },
        {
          icon: 'http://www.passportjs.org/images/favicon/apple-icon-57x57.png',
          name: 'passport',
          desc: 'Node.js的简单，不显眼的身份验证',
          url: 'http://www.passportjs.org/',
          language: [
            '',
            '',
            'https://github.com/jaredhanson/passport'
          ]
        },
        {
          name: 'parameter',
          desc: '参数验证工具',
          url: 'https://github.com/node-modules/parameter',
        },
        {
          name: 'bytes',
          desc: '用于解析字符串字节, b/kb/mb/gb/tb/pb',
          url: 'https://github.com/visionmedia/bytes.js',
        },
        {
          icon: 'https://avatars2.githubusercontent.com/u/723678?s=200&v=4',
          name: 'js-yaml',
          desc: 'JavaScript YAML解析器和转储器。非常快',
          url: 'https://nodeca.github.io/js-yaml/',
          language: [
            '',
            '',
            'https://github.com/nodeca/js-yaml'
          ]
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/34631683?s=200&v=4',
          name: 'acorn',
          desc: '一个小型，基于JavaScript的快速JavaScript解析器',
          url: 'https://github.com/acornjs/acorn',
        },
        {
          name: 'figlet.js',
          desc: '用JavaScript编写的FIG驱动程序，旨在完全实现FIGfont规范, 生成ascii',
          url: 'https://github.com/patorjk/figlet.js',
        },
        {
          name: 'node-printer',
          desc: '本机 node.js 打印机',
          url: 'https://github.com/tojocky/node-printer',
        },
        {
          name: 'fontmin',
          desc: '无缝缩小字体',
          url: 'https://github.com/ecomfe/fontmin',
        },
        {
          icon: 'https://avatars1.githubusercontent.com/u/5658226?s=200&v=4',
          name: 'morgan',
          desc: 'Node.js的HTTP请求记录器中间件',
          url: 'https://github.com/expressjs/morgan',
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/9271229?s=200&v=4',
          name: 'jsdom',
          desc: '与Node.js一起使用的各种Web标准的JavaScript实现',
          url: 'https://github.com/jsdom/jsdom',
        },
      ]
    },
  ]
}