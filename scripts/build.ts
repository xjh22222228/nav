// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejia.he. All rights reserved.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import { writeSEO, writeTemplate, spiderWeb, PATHS } from './utils'
import type { INavProps, ISettings } from '../src/types/index'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

const handleFileOperation = (operation: () => any): any => {
  try {
    return operation()
  } catch (error) {
    console.error(`File operation failed: ${(error as Error).message}`)
    return null
  }
}

const db: INavProps[] = handleFileOperation(() =>
  JSON.parse(fs.readFileSync(PATHS.db, 'utf-8'))
)
const settings: ISettings = handleFileOperation(() =>
  JSON.parse(fs.readFileSync(PATHS.settings, 'utf-8'))
)

const seoTemplate = writeSEO(db, { settings })
const html = writeTemplate({
  html: fs.readFileSync(PATHS.html.main, 'utf-8'),
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
