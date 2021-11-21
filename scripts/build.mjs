// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import config from '../nav.config.js'
import path from 'path'
import LOAD_MAP from './loading.js'

const dbPath = path.join('.', 'data', 'db.json')
const setPath = path.join('.', 'data', 'settings.json')
const pkgPath = path.join('package.json')

const pkg = JSON.parse(fs.readFileSync(pkgPath).toString())
const settings = JSON.parse(fs.readFileSync(setPath).toString())

function addZero(num) {
  return num < 10 ? '0' + num : num
}

const now = new Date()
console.log('Timezone: ', now.getTimezoneOffset())
now.setHours(now.getHours() + 8)
const date = `${now.getFullYear()}年${addZero(now.getMonth() + 1)}月${addZero(now.getDate())}日 ${addZero(now.getHours())}:${addZero(now.getMinutes())}:${addZero(now.getSeconds())}`

const {
  description,
  title,
  keywords,
  baiduStatisticsUrl,
  cnzzStatisticsUrl,
  loading,
  favicon
} = settings

const {
  gitRepoUrl,
  homeUrl,
} = config.default

const s = gitRepoUrl.split('/')

const authorName = s[s.length - 2]
const repoName = s[s.length - 1]

const htmlTemplate = `
  <!-- https://github.com/xjh22222228/nav -->
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <link rel="icon" href="${favicon}">
  <link rel ="apple-touch-icon" href="${favicon}">
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
  t = t.replace(/<title>.*<\/title>/i, '')
  t = t.replace('<link rel="icon" href="assets/logo.png">', '')
  t = t.replace('<!-- nav.config -->', htmlTemplate)

  if (baiduStatisticsUrl) {
    t = t.replace('<!-- nav.script -->', scriptTemplate)
  }

  t = t.replace('<!-- nav.seo -->', seoTemplate)
  t = t.replace('<!-- nav.loading -->', LOAD_MAP[getLoadKey()] || '')

  fs.writeFileSync(htmlPath, t, { encoding: 'utf-8' })
  fs.unlinkSync('./nav.config.js')
  console.log('Build done!')
}

buildSeo()
.finally(() => build())
.catch(console.error)

function getLoadKey() {
  const keys = Object.keys(LOAD_MAP)
  const rand = Math.floor(Math.random() * keys.length)
  const loadingKey = loading === 'random' ? keys[rand] : loading
  return loadingKey
}
