// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejia.he. All rights reserved.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import { writeSEO, writeTemplate, spiderWeb } from './util.mjs'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

const PATHS = {
  db: path.join('.', 'data', 'db.json'),
  settings: path.join('.', 'data', 'settings.json'),
  html: {
    main: path.join('.', 'src', 'main.html'),
    write: path.join('.', 'src', 'index.html'),
  },
}

const handleFileOperation = (operation) => {
  try {
    return operation()
  } catch (error) {
    console.error(`File operation failed: ${error.message}`)
    return null
  }
}

const db = handleFileOperation(() =>
  JSON.parse(fs.readFileSync(PATHS.db).toString())
)
const settings = handleFileOperation(() =>
  JSON.parse(fs.readFileSync(PATHS.settings).toString())
)

const seoTemplate = writeSEO(db, { settings })
const html = writeTemplate({
  html: fs.readFileSync(PATHS.html.main).toString(),
  settings,
  seoTemplate,
})

handleFileOperation(() => fs.writeFileSync(PATHS.html.write, html))

let errorUrlCount = 0

process.on('exit', () => {
  settings.errorUrlCount = errorUrlCount
  handleFileOperation(() => {
    fs.writeFileSync(PATHS.settings, JSON.stringify(settings))
    fs.writeFileSync(PATHS.db, JSON.stringify(db))
  })
  console.log('All success!')
})

const { errorUrlCount: count } = await spiderWeb(db, settings)
errorUrlCount = count
