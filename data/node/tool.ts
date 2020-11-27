export default {
  title: '辅助工具',
  icon: 'https://nodejs.org/static/images/favicons/favicon.ico',
  nav: [
    {
      title: '调试debugger',
      nav: [
        {
          name: 'node-inspector',
          desc: 'Node.js调试器基于Blink Developer Tools',
          url: 'https://github.com/node-inspector/node-inspector',
        },
        {
          name: 'debug',
          desc: '一个微小的JavaScript调试工具，以Node.js核心的调试技术为模型。适用于Node.js和Web浏览器',
          url: 'https://github.com/visionmedia/debug',
        },
        {
          name: 'ndb',
          desc: 'ndb是针对Node.js的改进调试体验，由Chrome DevTools启用',
          url: 'https://github.com/GoogleChromeLabs/ndb',
        },
      ]
    },
    {
      title: 'node版本管理',
      nav: [
        {
          name: 'nvm',
          desc: 'Node版本管理器 - 用于管理多个活动node.js版本的简单bash脚本',
          url: 'https://github.com/creationix/nvm',
        },
        {
          name: 'nvm-windows',
          desc: '适用于Windows的node.js版本管理实用程序',
          url: 'https://github.com/coreybutler/nvm-windows',
        },
        {
          name: 'nvs',
          desc: 'Node Version Switcher - 用于在Node.js的版本和分支之间切换的跨平台工具(受到nvm的启发)',
          url: 'https://github.com/jasongin/nvs',
        },
        {
          name: 'n',
          desc: 'Node.js版本管理：无配置文件，无复杂的API，非常简单',
          url: 'https://github.com/tj/n',
        },
      ]
    },
    {
      title: '日志管理',
      nav: [
        {
          name: 'log4js-node',
          desc: 'log4js 是一个 nodejs 日志管理工具，可以将日志以各种形式输出到各种渠道。',
          url: 'https://log4js-node.github.io/log4js-node/index.html',
          language: [
            '',
            '',
            'https://github.com/log4js-node/log4js-node'
          ]
        },
        {
          name: 'node-bunyan',
          desc: '用于node.js服务的简单快速的JSON日志记录模块',
          url: 'https://github.com/trentm/node-bunyan',
        },
      ]
    },
    {
      title: '集成工具',
      nav: [
        {
          icon: 'https://avatars0.githubusercontent.com/u/1714870?s=200&v=4',
          name: 'yeoman',
          desc: '一套用于自动化开发工作流程的工具',
          url: 'https://yeoman.io/',
          language: [
            '',
            '',
            'https://github.com/yeoman/yeoman'
          ]
        },
        {
          icon: 'https://avatars0.githubusercontent.com/u/16486629?s=200&v=4',
          name: 'nodemailer',
          desc: '发送来自Node.js的电子邮件 - 很容易就像蛋糕一样！',
          url: 'http://nodemailer.com/',
          language: [
            '',
            '',
            'https://github.com/nodemailer/nodemailer'
          ]
        },
        {
          name: 'gh-pages',
          desc: '将文件发布到GitHub上的gh-pages分支的常规任务',
          url: 'https://github.com/tschaub/gh-pages',
        },
      ]
    },
    {
      title: '代码压缩',
      nav: [
        {
          icon: 'https://avatars1.githubusercontent.com/u/43502240?s=200&v=4',
          name: 'terser',
          desc: '适用于ES6+的JavaScript解析器，mangler和压缩器工具包',
          url: 'https://terser.org/',
          language: [
            '',
            '',
            'https://github.com/terser/terser'
          ]
        },
      ]
    },
    {
      title: '其他',
      nav: [
        {
          name: 'Awehunt',
          desc: 'npm包下载量曲线对比图',
          url: 'https://awehunt.com/npmdownloads?ids=react,angular,vue',
        },
        {
          name: 'nodemon',
          desc: '监视node.js应用程序中的任何更改并自动重新启动服务器 - 非常适合开发',
          url: 'https://nodemon.io/',
          language: [
            '',
            '',
            'https://github.com/remy/nodemon'
          ]
        },
        {
          name: 'pkg',
          desc: '将Node.js项目打包成可执行文件',
          url: 'https://github.com/zeit/pkg',
        },
        {
          name: 'npm-check-updates',
          desc: '查找package.json或bower.json允许的更新版本的软件包依赖项',
          url: 'https://github.com/tjunnone/npm-check-updates',
        },
        {
          name: 'husky',
          desc: 'husky 可以防止错误的 git commit, git push 等',
          url: 'https://github.com/typicode/husky',
        },
        {
          name: 'bundlephobia',
          desc: '找出在项目中添加新的依赖项的包大小',
          url: 'https://bundlephobia.com',
          language: [
            '',
            '',
            'https://github.com/pastelsky/bundlephobia'
          ]
        },
        {
          name: 'npm-run-all',
          desc: '一个CLI工具，可并行或顺序运行多个npm脚本',
          url: 'https://github.com/mysticatea/npm-run-all',
        },
        {
          name: 'dotenv',
          desc: '从.env加载用于nodejs项目的环境变量',
          url: 'https://github.com/motdotla/dotenv#readme',
        },
        {
          name: 'cross-env',
          desc: '运行跨平台设置和使用环境变量的脚本',
          url: 'https://github.com/kentcdodds/cross-env',
        },
        {
          name: 'nrm',
          desc: 'npm源快速切换， npm, cnpm, taobao, nj, 内网',
          url: 'https://github.com/Pana/nrm',
        },
      ]
    },
  ]
}