// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import fs from 'fs'
import config from './nav.config.js'
import path from 'path'

const now = new Date()
const date = `${now.getMonth() + 1}-${now.getDate()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}`

const { description, title, keywords, baiduStatisticsUrl } = config.default
const htmlTemplate = `
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
`.trim()

const scriptTemplate = `
<script>
var _hmt = _hmt || [];
var hm = document.createElement('script');
hm.async = true;
hm.src = '${baiduStatisticsUrl}';
var s = document.getElementsByTagName("script")[0]; 
s.parentNode.insertBefore(hm, s);
</script>
<span data-date="${date}" id="BUILD-DATE-NAV"></span>
`.trim()

try {
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
