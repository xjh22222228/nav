// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

// 只需要修改这两行代码
// 拉下来的仓库位置，填写绝对路径
const DEPLOY_DIR = '/www/nav'
// 启动端口
const PORT = 7777

// ------------------- 下面代码不需要看 ---------------------
const express = require('express')
const fs = require('fs')
const { execSync } = require('child_process')

// 创建 Express 应用实例
const app = express()

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
