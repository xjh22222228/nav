// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import config from '../../nav.config'
import http, { httpNav } from '../utils/http'
import { encode } from 'js-base64'
import { settings } from 'src/store'

const { gitRepoUrl } = config
const s = gitRepoUrl.split('/')
const DEFAULT_BRANCH = config.branch

export const authorName = s[s.length - 2]
export const repoName = s[s.length - 1]

function isGitee() {
  return config.provider === 'Gitee'
}

// 验证Token
export function verifyToken(token: string) {
  return http.get(`/users/${authorName}`, {
    headers: {
      Authorization: `token ${token.trim()}`,
    },
  })
}

// 创建分支
export async function createBranch(branch: string) {
  const url = isGitee()
    ? `/repos/${authorName}/${repoName}/branches`
    : `/repos/${authorName}/${repoName}/git/refs`
  const params: Record<string, any> = {}
  if (isGitee()) {
    params['owner'] = `/${authorName}`
    params['repo'] = `/${authorName}/${repoName}`
    params['refs'] = DEFAULT_BRANCH
    params['branch_name'] = branch
  } else {
    params['sha'] = 'c1fdab3d29df4740bb97a4ae7f24ed0eaa682557'
    try {
      const commitRes = await getCommits()
      if (commitRes.data?.length > 0) {
        params['sha'] = commitRes.data[0]['sha']
      }
    } catch (error) {}

    params['ref'] = `refs/heads/${branch}`
  }
  return http.post(url, params)
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

export function getCommits() {
  return http.get(`/repos/${authorName}/${repoName}/commits`)
}

export async function createFile({
  message,
  content,
  path,
  branch = DEFAULT_BRANCH,
  isEncode = true,
}: Iupdate) {
  const method = isGitee() ? http.post : http.put
  return method(`/repos/${authorName}/${repoName}/contents/${path}`, {
    message: `rebot(CI): ${message}`,
    branch,
    content: isEncode ? encode(content) : content,
  }).then((res) => {
    requestActionUrl()
    return res
  })
}

export async function getUserCollect(data?: Record<string, any>) {
  return httpNav.post('/api/get', data)
}

export async function saveUserCollect(data?: Record<string, any>) {
  return httpNav.post('/api/save', data)
}

export async function delUserCollect(data?: Record<string, any>) {
  return httpNav.post('/api/delete', data)
}

export async function getIconUrl(url: string) {
  return httpNav.post('/api/icon', { url })
}

export function getCDN(path: string, branch = 'image') {
  if (isGitee()) {
    return `https://gitee.com/${authorName}/${repoName}/raw/${branch}/${path}`
  }
  return `https://cdn.jsdelivr.net/gh/${authorName}/${repoName}@${branch}/${path}`
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
