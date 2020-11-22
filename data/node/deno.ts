
const DEFAULT_ICON = 'https://avatars1.githubusercontent.com/u/42048915?s=200&v=4';

export default {
  title: 'Deno',
  nav: [
    {
      title: '官方',
      icon: DEFAULT_ICON,
      nav: [
        {
          name: 'Deno',
          desc: '一个安全的运行时的JavaScript和TypeScript',
          url: 'https://deno.land/',
          language: [
            '',
            '',
            'https://github.com/denoland'
          ]
        },
        {
          name: 'Deno 标准库',
          desc: 'Deno 标准库',
          url: 'https://deno.land/std',
        },
      ]
    },
    {
      title: '工具',
      icon: DEFAULT_ICON,
      nav: [
        {
          name: 'Deno',
          desc: '适用于Deno的Visual Studio Code插件',
          url: 'https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno',
          language: [
            '',
            '',
            'https://github.com/denoland/vscode_deno'
          ]
        },
      ]
    }
  ]
}
