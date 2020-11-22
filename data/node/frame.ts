export default {
  title: '跨平台框架',
  nav: [
    {
      title: 'Electron',
      icon: 'https://www.electronjs.org/images/favicon.ico',
      nav: [
        {
          name: 'Electron',
          desc: '使用 JavaScript, HTML 和 CSS 构建跨平台的桌面应用',
          url: 'https://electronjs.org/',
          language: [
            '',
            '',
            'https://github.com/electron/electron'
          ]
        },
        {
          name: 'electron-packager',
          desc: '通过JS或CLI自定义和封装您的Electron应用程序与特定于操作系统的软件包（.app，.exe等）',
          url: 'https://github.com/electron-userland/electron-packager',
        },
        {
          name: 'electron-installer-dmg',
          desc: '使用AppDMG为电子应用程序创建DMG安装程序',
          url: 'https://github.com/electron-userland/electron-installer-dmg',
        },
        {
          icon: 'https://simulatedgreg.gitbooks.io/electron-vue/content/gitbook/images/apple-touch-icon-precomposed-152.png',
          name: 'electron-vue',
          desc: '基于 vue (基本上是它听起来的样子) 来构造 electron 应用程序的样板代码。',
          url: 'https://simulatedgreg.gitbooks.io/electron-vue/content/cn/',
          language: [
            'https://simulatedgreg.gitbooks.io/electron-vue/content/en/',
            'https://simulatedgreg.gitbooks.io/electron-vue/content/cn/',
            'https://github.com/SimulatedGREG/electron-vue'
          ]
        },
        {
          icon: 'https://www.electron.build/assets/images/favicon.png',
          name: 'electron-builder',
          desc: '一个开箱即用的完整解决方案，用于将Electron, Proton Native or Muon 打包、构建成支持macOS, Windows and Linux三大系统的，可”自动更新”的可发布安装程序',
          url: 'https://www.electron.build/',
          language: [
            '',
            '',
            'https://github.com/electron-userland/electron-builder'
          ]
        },
        {
          icon: 'https://electron-react-boilerplate.js.org/logo/logo.png',
          name: 'electron-react-boilerplate',
          desc: '基于React可扩展跨平台应用程序的App',
          url: 'https://electron-react-boilerplate.js.org/',
          language: [
            '',
            '',
            'https://github.com/electron-react-boilerplate/electron-react-boilerplate'
          ]
        },
        {
          name: 'menubar',
          desc: 'Electron创建菜单栏桌面应用程序的高级方法。',
          url: 'https://github.com/maxogden/menubar',
        },
      ]
    },
    {
      title: 'nw.js',
      nav: [
        {
          icon: 'https://nwjs.org.cn/asset/img/favicon.ico',
          name: 'nw.js',
          desc: '从DOM/WebWorker层,直接调用所有的Node模块，使用现有的web技术，开启一个全新的编写应用的方式',
          url: 'https://nwjs.org.cn/',
          language: [
            'https://nwjs.io/',
            'https://nwjs.org.cn/',
            'https://github.com/nwjs/nw.js'
          ]
        },
        {
          icon: 'https://nwjs.org.cn/asset/img/favicon.ico',
          name: 'nw-builder',
          desc: '以编程方式或通过CLI 构建适用于Mac，Win和Linux的NW.js应用程序。',
          url: 'https://github.com/nwjs-community/nw-builder',
        },
        {
          icon: 'https://nwjs.org.cn/asset/img/favicon.ico',
          name: 'nwjs-ffmpeg-prebuilt',
          desc: 'FFMpeg预构建的二进制文件具有专有的编解码器和构建窗口。',
          url: 'https://github.com/iteufel/nwjs-ffmpeg-prebuilt',
        },
      ]
    },
  ]
}
