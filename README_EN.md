<p align="center">
  <a href="https://nav3.cn/?g">
    <img src="https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/logo.svg" width="130" />
  </a>
  <br />
  <b>Discovery Navigation</b>
  <p align="center">A powerful navigation website that is purely static, supports SEO, and online editing</p>
  <p align="center">Built-in collection of 800+ high-quality websites to assist your work, study, and life</p>
  <p align="center">
    <a href="README.md"><img alt="简体中文" src="https://img.shields.io/static/v1.svg?label=&message=zh_cn&style=flat-square&color=ff5000"></a>
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

## Design Philosophy

No database, no server, zero-cost one-click deployment, ready to use out of the box, yet capable of manipulating and saving data like a database.

Easy to use, simple, and powerful.

[Who is using it?](https://official.nav3.cn/?id=3)

## Features

- 🍰 Built-in `800+` high-quality websites
- 🍰 Support for [Gitee](https://gitee.com/xiejiahe/nav)
- 🍰 Support for [GitLab](https://gitlab.com/xjh22222228/nav)
- 🍰 Support for importing from browser bookmarks
- 🍰 Support for exporting data to browser bookmarks
- 🍰 Support for AI translation
- 🍰 Support for user submissions, edits, and deletions
- 🍰 Support for self-deployment (pm2|Docker|BT Panel)/Fork
- 🍰 Support for category/website movement and references
- 🍰 Support for SEO search engines
- 🍰 Support for associating websites with multiple URLs or tags
- 🍰 Support for detecting website status
- 🍰 Support for configuring visibility only to yourself
- 🍰 Support for automatically fetching website icons/names/descriptions
- 🍰 Support for widget personalization
- 🍰 Support for dark mode
- 🍰 Support for backend management without deployment
- 🍰 Support for footprint memory
- 🍰 Support for multiple search queries
- 🍰 Support for custom search engines
- 🍰 Support for card advertisement display
- 🍰 Multiple high-value themes to switch between
- 🍰 Powerful responsive system
- 🍰 Various loading animations
- 🍰 Multiple card style designs
- 🍰 Completely static with automated deployment functionality
- 🍰 Ternary tree categorization with clear structure and classification

## Preview

- [https://nav3.cn](https://nav3.cn)

![Preview](https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/preview.gif)

## Use Cases

- Deploy internal company navigation system for unified link management
- Personal bookmark management, browser bookmark alternative
- Personal navigation website for sharing, value, and discovery

## Deployment

Zero-cost deployment, as easy as counting `3-2-1`.

#### gh-pages (Free)

1. Click `Fork` in the top right corner.

2. Apply for a `token` at [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new), select appropriate permissions (select all if unsure), copy and save the Token; [For Gitee, click here](https://gitee.com/profile/personal_access_tokens/new)

3. Add the token at https://github.com/your-username/nav/settings/secrets/actions/new, name it `TOKEN` in uppercase.

4. Open https://github.com/your-username/nav/actions to enable automatic deployment

5. Modify the `gitRepoUrl` field in the root configuration file [nav.config.yaml](nav.config.yaml)

6. Open https://your-username.github.io/nav to see your powerful navigation website.

#### Netlify (Recommended, Free)

build path `dist/browser`

[https://www.netlify.com/](https://www.netlify.com/)

#### Vercel (Recommended, Free)

[https://github.com/apps/vercel](https://github.com/apps/vercel)

#### Cloudflare pages (Recommended, Free)

[https://www.cloudflare.com](https://www.cloudflare.com)

## Configuration

Only need to modify the following fields in the root `nav.config.yaml`
|Fork |Self-Deploy | Field | Description |
| --------------------------------------------- | -------- |--- |--- |
|√ | | gitRepoUrl | Your repository URL |
|√ | | branch | Deployment branch |
|√ | √| hashMode | Whether to use Hash mode for routing, must be true for `github pages` |
| | √| password | Self-deployment login password, not needed for `Fork` users |
| | √| address | Self-deployment address |
|√| √| email | User submission notification |
| | √| mailConfig | Email configuration for self-deployment notifications |
|√ | | imageRepoUrl | Image repository, default `https://github.com/xjh22222228/image?branch=main` |

## Backend

Change the route to `system` to access, e.g., https://www.nav3.cn to https://www.nav3.cn/system

## Upgrade

#### Automatic

For `Fork` users only

[Install Pull here](https://github.com/apps/pull), updates will automatically create Pull Requests for your repository.

#### Manual

Clone your repository and execute:

```bash
git pull
git remote add upstream https://gitee.com/xiejiahe/nav.git
git fetch upstream main
git merge upstream/main --allow-unrelated-histories --no-edit
git push

# If node is installed, just run
npm run update
```

## Support

This project has been maintained and open-sourced since 2018, through numerous iterations and optimizations. It's my honor if this project can help you.

You can buy the author a coffee to keep fighting

<img src="https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/img/32.png" width="600">

## LICENSE

For commercial sites, themes, projects, and applications, keep your source code private/proprietary by purchasing a Commercial License .

Licensed under the GNU General Public License 3.0 for compatible open source projects and non-commercial use.

Copyright 2024-present xiejiahe
