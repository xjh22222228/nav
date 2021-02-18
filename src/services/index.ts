// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import config from '../../nav.config'
import http from '../utils/http'
import { encode } from 'js-base64'
import { getToken } from '../utils/user'

const { gitRepoUrl } = config
const s = gitRepoUrl.split('/')
const DEFAULT_BRANCH = config.branch

export const authorName = s[s.length - 2]
export const repoName = s[s.length - 1]
const token = getToken()

// 验证Token
export function verifyToken(token: string) {
  return http.get(`/users/${authorName}`, {
    headers: {
      Authorization: `token ${token}`
    }
  })
}

// 获取文件信息
export function getFileContent(path: string, authToken?: string, branch: string = DEFAULT_BRANCH) {
  const _token = `${authToken ? authToken : token}`.trim()
  return http.get(`/repos/${authorName}/${repoName}/contents/${path}`, {
    headers: {
      Authorization: `token ${_token}`
    },
    params: {
      ref: branch
    }
  })
}

// 更新文件内容
type Iupdate = {
  message: string
  content: string
  path: string
  branch?: string
  isEncode?: boolean
}
export async function updateFileContent(
  { message, content, path, branch = DEFAULT_BRANCH, isEncode = true }: Iupdate,
  authToken?: string
) {
  const _token = `${authToken ? authToken : token}`.trim()
  const fileInfo = await getFileContent(path, _token, branch)

  return http.put(`/repos/${authorName}/${repoName}/contents/${path}`, {
    message: `rebot(CI): ${message}`,
    branch,
    content: isEncode ? encode(content) : content,
    sha: fileInfo.data.sha
  }, {
    headers: {
      Authorization: `token ${_token}`
    }
  })
}

export async function createFile(
  { message, content, path, branch = DEFAULT_BRANCH, isEncode = true }: Iupdate,
  authToken?: string
) {
  const _token = `${authToken ? authToken : token}`.trim()

  return http.put(`/repos/${authorName}/${repoName}/contents/${path}`, {
    message: `rebot(CI): ${message}`,
    branch,
    content: isEncode ? encode(content) : content,
  }, {
    headers: {
      Authorization: `token ${_token}`
    }
  })
}

export function getCDN(path: string) {
  return `https://raw.sevencdn.com/${authorName}/${repoName}/image/${path}`
}
