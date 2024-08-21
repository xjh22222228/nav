// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav
import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import bodyParser from 'body-parser'
import history from 'connect-history-api-fallback'
import compression from 'compression'
import {
  getWebCount,
  setWeb,
  spiderWeb,
  writeSEO,
  writeTemplate,
} from './scripts/util.mjs'

const joinPath = (p) => {
  return path.resolve(process.cwd(), p)
}
function getPackageJson() {
  return JSON.parse(fs.readFileSync(joinPath('package.json')).toString())
}
const PORT = getPackageJson().port
const UPLOAD_FOLDER_PATH = joinPath('_upload/images')
const DB_PATH = joinPath('data/db.json')
const SETTINGS_PATH = joinPath('data/settings.json')
const TAG_PATH = joinPath('data/tag.json')
const SEARCH_PATH = joinPath('data/search.json')
const ENTRY_INDEX_HTML = joinPath('dist/index.html')

const app = express()

app.use(compression())
app.use(history())
app.use(bodyParser.json({ limit: '10000mb' }))
app.use(
  cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  })
)
app.use(express.static('dist'))
app.use(express.static('_upload'))

function verifyMiddleware(req, res, next) {
  const token = req.headers['authorization']
  if (token !== `token ${getPackageJson().password}`) {
    res.status(401)
    return res.json({
      status: 401,
      message: 'Bad credentials',
    })
  }
  next(false)
}

app.get('/api/users/verify', verifyMiddleware, (req, res) => {
  res.json({})
})

app.post('/api/contents/update', verifyMiddleware, (req, res) => {
  const { path, content } = req.body
  try {
    fs.writeFileSync(joinPath(path), content)

    if (path.includes('settings.json')) {
      const isExistsindexHtml = fs.existsSync(ENTRY_INDEX_HTML)
      if (isExistsindexHtml) {
        const indexHtml = fs.readFileSync(ENTRY_INDEX_HTML).toString()
        const webs = JSON.parse(fs.readFileSync(DB_PATH).toString())
        const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH).toString())
        const pkg = getPackageJson()
        const seoTemplate = writeSEO(webs, { settings, pkg })
        const html = writeTemplate({
          html: indexHtml,
          settings,
          seoTemplate,
        })
        fs.writeFileSync(ENTRY_INDEX_HTML, html)
      }
    }

    res.json({})
  } catch (error) {
    res.status(500)
    res.json({
      message: error.message,
    })
  }
})

app.post('/api/contents/create', verifyMiddleware, (req, res) => {
  const { path: filePath, content } = req.body
  try {
    try {
      fs.statSync(UPLOAD_FOLDER_PATH)
    } catch (error) {
      fs.mkdirSync(UPLOAD_FOLDER_PATH)
    }

    const dataBuffer = Buffer.from(content, 'base64')
    const uploadPath = path.join(UPLOAD_FOLDER_PATH, filePath)
    fs.writeFileSync(uploadPath, dataBuffer)
    res.json({
      imagePath: path.join('/', 'images', filePath),
    })
  } catch (error) {
    res.status(500)
    res.json({
      message: error.message,
    })
  }
})

app.post('/api/contents/get', (req, res) => {
  const params = {
    webs: [],
    settings: {},
    tags: [],
    search: [],
    internal: {},
  }
  try {
    params.webs = JSON.parse(fs.readFileSync(DB_PATH).toString())
    params.settings = JSON.parse(fs.readFileSync(SETTINGS_PATH).toString())
    params.tags = JSON.parse(fs.readFileSync(TAG_PATH).toString())
    params.search = JSON.parse(fs.readFileSync(SEARCH_PATH).toString())
    const { userViewCount, loginViewCount } = getWebCount(params.webs)
    params.internal.userViewCount = userViewCount
    params.internal.loginViewCount = loginViewCount
    params.webs = setWeb(params.webs)
    return res.json({
      ...params,
    })
  } catch (error) {
    res.status(500)
    res.json({
      message: error.message,
    })
  }
})

app.post('/api/spider', async (req, res) => {
  try {
    const webs = JSON.parse(fs.readFileSync(DB_PATH).toString())
    const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH).toString())
    const { time, webs: w, errorUrlCount } = await spiderWeb(webs, settings)
    settings.errorUrlCount = errorUrlCount
    fs.writeFileSync(DB_PATH, JSON.stringify(w))
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings))
    return res.json({
      time,
    })
  } catch (error) {
    res.status(500)
    res.json({
      message: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT}`)
})
