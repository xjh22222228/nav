import path from 'node:path'
import fs from 'node:fs'

const internalPath = path.join('.', 'data', 'internal.json')
const internal = JSON.parse(fs.readFileSync(internalPath).toString())
internal.buildTime = Math.ceil((Date.now() - internal.buildTime) / 1000)
fs.writeFileSync(internalPath, JSON.stringify(internal), {
  encoding: 'utf-8',
})
