// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import config from '../nav.config.js'
import path from 'path'

const dbPath = path.join('.', 'data', 'db.json')
const pkgPath = path.join('package.json')

const pkg = JSON.parse(fs.readFileSync(pkgPath).toString())

function addZero(num) {
  return num < 10 ? '0' + num : num
}

const now = new Date()
console.log('Timezone: ', now.getTimezoneOffset())
now.setHours(now.getHours() + 8)
const date = `${now.getFullYear()}年${addZero(now.getMonth() + 1)}月${addZero(now.getDate())}日 ${addZero(now.getHours())}:${addZero(now.getMinutes())}:${addZero(now.getSeconds())}`

const {
  gitRepoUrl,
  homeUrl,
  description,
  title,
  keywords,
  baiduStatisticsUrl,
  cnzzStatisticsUrl
} = config.default

const s = gitRepoUrl.split('/')

const authorName = s[s.length - 2]
const repoName = s[s.length - 1]

const htmlTemplate = `
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
`.trim()

const cnzzScript = !cnzzStatisticsUrl ? '' : `<script src="${cnzzStatisticsUrl}"></script>`
const baiduScript = !baiduStatisticsUrl ? '' : `
<script>
var _hmt = _hmt || [];
var hm = document.createElement('script');
hm.async = true;
hm.src = '${baiduStatisticsUrl}';
var s = document.getElementsByTagName("script")[0]; 
s.parentNode.insertBefore(hm, s);
</script>
`

let scriptTemplate = `
${baiduScript}
${cnzzScript}
<span style="display:none;" data-date="${date}" data-version="${pkg.version}" id="META-NAV"></span>
`.trim()

let seoTemplate = `
<div data-url="https://github.com/xjh22222228/nav" style="z-index:-1;position:fixed;top:-10000vh;left:-10000vh;">
`

async function buildSeo() {
  const readDb = fs.readFileSync(dbPath).toString()
  const parseDbJson = JSON.parse(readDb)

  function r(navList) {
    for (let value of navList) {
      if (Array.isArray(value.nav)) {
        r(value.nav)
      }

      seoTemplate += `<h3>${value.title || value.name || title}</h3>${value.icon ? `<img data-src="${value.icon}" alt="${homeUrl}" />` : ''}<p>${value.desc || description}</p><a href="${value.url || homeUrl || gitRepoUrl}"></a>`

      if (value.urls && typeof value.urls === 'object') {
        for (let k in value.urls) {
          seoTemplate += `<a href="${value.urls[k] || homeUrl || gitRepoUrl}"></a>`
        }
      }
    }
  }

  r(parseDbJson)

  seoTemplate += '</div>'
}

async function build() {
  const htmlPath = path.join('.', 'src', 'index.html')
  let t = fs.readFileSync(htmlPath).toString()
  t = t.replace('<!-- nav.config -->', htmlTemplate)

  if (baiduStatisticsUrl) {
    t = t.replace('<!-- nav.script -->', scriptTemplate)
  }

  t = t.replace('assets/logo.png', `https://raw.sevencdn.com/${authorName}/${repoName}/image/logo.png`)
  t = t.replace('assets/logo.png', `https://raw.sevencdn.com/${authorName}/${repoName}/image/logo.png`)
  t = t.replace('assets/logo.png', `https://raw.sevencdn.com/${authorName}/${repoName}/image/logo.png`)
  t = t.replace('assets/logo.png', `https://raw.sevencdn.com/${authorName}/${repoName}/image/logo.png`)
  t = t.replace('assets/logo.png', `https://raw.sevencdn.com/${authorName}/${repoName}/image/logo.png`)

  t = t.replace('<!-- nav.seo -->', seoTemplate)

  fs.writeFileSync(htmlPath, t, { encoding: 'utf-8' })
  fs.unlinkSync('./nav.config.js')
  console.log('Build done!')
}

buildSeo()
.finally(() => build())
.catch(console.error)
