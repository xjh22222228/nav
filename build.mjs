// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import fs from 'fs'
import config from './nav.config.js'
import path from 'path'

const { description, title, keywords, tongjiUrl } = config.default
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
hm.src = 'https://hm.baidu.com/hm.js?32c73f6240df008812d40821b82ea2b7';
var s = document.getElementsByTagName("script")[0]; 
s.parentNode.insertBefore(hm, s);
</script>
`.trim()

try {
  const htmlPath = path.join('.', 'src', 'index.html')
  const readHtml = fs.readFileSync(htmlPath).toString()
  let t = readHtml.replace('<!-- nav.config -->', htmlTemplate)

  if (tongjiUrl) {
    t = t.replace('<!-- nav.script -->', scriptTemplate)
  }

  fs.writeFileSync(htmlPath, t, { encoding: 'utf-8' })
  fs.unlinkSync('./nav.config.js')
  console.log('Build done!')
} catch (error) {
  console.log(error)
}
