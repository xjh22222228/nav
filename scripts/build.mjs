// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import fs from 'fs'
import config from '../nav.config.js'
import path from 'path'

function addZero(num) {
  return num < 10 ? '0' + num : num
}

const now = new Date()
now.setHours(now.getHours() + 8)
const date = `${now.getFullYear()}年${addZero(now.getMonth() + 1)}月${addZero(now.getDate())}日 ${addZero(now.getHours())}:${addZero(now.getMinutes())}`

const {
  description,
  title,
  keywords,
  baiduStatisticsUrl,
  cnzzStatisticsUrl
} = config.default

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
<span data-date="${date}" id="BUILD-DATE-NAV"></span>
`.trim()

try {
  fs.copyFileSync(
    path.join('.', 'logo.png'),
    path.join('.', 'src', 'assets', 'logo.png')
  )

  const htmlPath = path.join('.', 'src', 'index.html')
  const readHtml = fs.readFileSync(htmlPath).toString()
  let t = readHtml.replace('<!-- nav.config -->', htmlTemplate)

  if (baiduStatisticsUrl) {
    t = t.replace('<!-- nav.script -->', scriptTemplate)
  }

  fs.writeFileSync(htmlPath, t, { encoding: 'utf-8' })
  fs.unlinkSync('./nav.config.js')
  console.log('Build done!')
} catch (error) {
  console.log(error)
}
