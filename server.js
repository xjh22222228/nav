// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

// 启动端口
const PORT = 7777
const DEPLOY_DIR = process.cwd()

const express = require('express')
const cors = require('cors')
const fs = require('node:fs')
const { execSync } = require('child_process')

// 创建 Express 应用实例
const app = express()

app.use(express.static('dist'))

app.get('/server', (req, res) => {
  console.log('正在部署...')
  let gitDir = ''
  try {
    gitDir = execSync('which git').toString()
  } catch (error) {
    return res.send('找不到 git 命令位置')
  }
  if (!fs.existsSync(DEPLOY_DIR)) {
    return res.send(`仓库目录不存在: ${DEPLOY_DIR}`)
  }

  try {
    const res = execSync(
      `cd ${DEPLOY_DIR} && npm run pull && npm run build`
    ).toString()
  } catch (error) {
    console.log('Failed:', error.message)
    return res?.send?.(error.message)
  }
  console.log('OK')
  res?.send?.('OK')
})

app.use(
  cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  })
)

app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT}`)
  console.log(`Directory: ${DEPLOY_DIR}`)
})
