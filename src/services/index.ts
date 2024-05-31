// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import config from '../../nav.config'
import http from '../utils/http'
import { encode } from 'js-base64'
import { settings } from 'src/store'

const { gitRepoUrl } = config
const s = gitRepoUrl.split('/')
const DEFAULT_BRANCH = config.branch

export const authorName = s[s.length - 2]
export const repoName = s[s.length - 1]

// 验证Token
export function verifyToken(token: string) {
  return http.get(`/users/${authorName}`, {
    headers: {
      Authorization: `token ${token.trim()}`,
    },
  })
}

// 创建分支
export function createBranch(branch: string) {
  return http.post(`/repos/${authorName}/${repoName}/git/refs`, {
    ref: `refs/heads/${branch}`,
    // https://github.com/xjh22222228/nav/commit/c1fdab3d29df4740bb97a4ae7f24ed0eaa682557
    sha: 'c1fdab3d29df4740bb97a4ae7f24ed0eaa682557',
  })
}

// 获取文件信息
export function getFileContent(path: string, branch: string = DEFAULT_BRANCH) {
  return http.get(`/repos/${authorName}/${repoName}/contents/${path}`, {
    params: {
      ref: branch,
    },
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
export async function updateFileContent({
  message = 'update',
  content,
  path,
  branch = DEFAULT_BRANCH,
  isEncode = true,
}: Iupdate) {
  const fileInfo = await getFileContent(path, branch)

  return http
    .put(`/repos/${authorName}/${repoName}/contents/${path}`, {
      message: `rebot(CI): ${message}`,
      branch,
      content: isEncode ? encode(content) : content,
      sha: fileInfo.data.sha,
    })
    .then((res) => {
      requestActionUrl()
      return res
    })
}

export async function createFile({
  message,
  content,
  path,
  branch = DEFAULT_BRANCH,
  isEncode = true,
}: Iupdate) {
  return http
    .put(`/repos/${authorName}/${repoName}/contents/${path}`, {
      message: `rebot(CI): ${message}`,
      branch,
      content: isEncode ? encode(content) : content,
    })
    .then((res) => {
      requestActionUrl()
      return res
    })
}

export function getCDN(path: string, branch = 'image') {
  return `https://cdn.jsdelivr.net/gh/${authorName}/${repoName}@${branch}/${path}`
  // return `https://raw.sevencdn.com/${authorName}/${repoName}/image/${path}`
}

function requestActionUrl() {
  const url = settings.actionUrl
  if (url) {
    const img = document.createElement('img')
    img.src = url
    document.body.appendChild(img)
    function cb() {
      img.parentNode?.removeChild(img)
    }
    img.onload = cb
    img.onerror = cb
  }
}
