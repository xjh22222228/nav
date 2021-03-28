// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import config from '../../nav.config'
import http from '../utils/http'
import { encode } from 'js-base64'

const { gitRepoUrl } = config
const s = gitRepoUrl.split('/')
const DEFAULT_BRANCH = config.branch

export const authorName = s[s.length - 2]
export const repoName = s[s.length - 1]

// 验证Token
export function verifyToken(token: string) {
  return http.get(`/users/${authorName}`, {
    headers: {
      Authorization: `token ${token}`
    }
  })
}

// 获取文件信息
export function getFileContent(path: string, branch: string = DEFAULT_BRANCH) {
  return http.get(`/repos/${authorName}/${repoName}/contents/${path}`, {
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
  {
    message,
    content,
    path,
    branch = DEFAULT_BRANCH,
    isEncode = true
  }: Iupdate,
) {
  const fileInfo = await getFileContent(path, branch)

  return http.put(`/repos/${authorName}/${repoName}/contents/${path}`, {
    message: `rebot(CI): ${message}`,
    branch,
    content: isEncode ? encode(content) : content,
    sha: fileInfo.data.sha
  })
}

export async function createFile(
  {
    message,
    content,
    path,
    branch = DEFAULT_BRANCH,
    isEncode = true
  }: Iupdate,
) {
  return http.put(`/repos/${authorName}/${repoName}/contents/${path}`, {
    message: `rebot(CI): ${message}`,
    branch,
    content: isEncode ? encode(content) : content,
  })
}

export function getCDN(path: string) {
  return `https://raw.sevencdn.com/${authorName}/${repoName}/image/${path}`
}
