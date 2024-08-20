// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import config from '../../nav.config.json'
import http, { httpNav } from '../utils/http'
import { encode } from 'js-base64'
import {
  settings,
  websiteList,
  tagList,
  getTagMap,
  searchEngineList,
  internal,
} from 'src/store'
import { ISettings } from 'src/types'
import { isSelfDevelop } from 'src/utils/util'

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
  const url = isSelfDevelop ? '/api/users/verify' : `/users/${authorName}`
  return http.get(url, {
    headers: {
      Authorization: `token ${token.trim()}`,
    },
  })
}

// 获取自有部署内容
export function getContentes() {
  return http.post('/api/contents/get').then((res: any) => {
    // 清空内容
    websiteList.splice(0, websiteList.length)
    searchEngineList.splice(0, searchEngineList.length)
    tagList.splice(0, tagList.length)

    internal.loginViewCount = res.data.internal.loginViewCount
    internal.userViewCount = res.data.internal.userViewCount
    res.data.webs.forEach((item: any) => {
      websiteList.push(item)
    })
    res.data.tags.forEach((item: any) => {
      tagList.push(item)
    })
    res.data.search.forEach((item: any) => {
      searchEngineList.push(item)
    })
    const resSettings = res.data.settings as ISettings
    for (const k in resSettings) {
      // @ts-ignore
      settings[k] = resSettings[k]
    }
    getTagMap()
    return res
  })
}

// 自有部署爬取信息
export function spiderWeb(data?: any) {
  return http
    .post('/api/spider', data, {
      timeout: 0,
    })
    .then((res) => {
      getContentes()
      return res
    })
}

// 创建分支
export async function createBranch(branch: string) {
  if (isSelfDevelop) {
    return
  }

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
  message?: string
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
  if (isSelfDevelop) {
    return http
      .post('/api/contents/update', {
        path,
        content,
      })
      .then((res) => {
        getContentes()
        requestActionUrl()
        return res
      })
  }

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
  if (isSelfDevelop) {
    return http
      .post('/api/contents/create', {
        path,
        content,
      })
      .then((res) => {
        requestActionUrl()
        return res
      })
  }

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

export async function getWebInfo(url: string) {
  try {
    const res = await httpNav.post('/api/icon', { url })
    return {
      ...res.data,
    }
  } catch {
    return {}
  }
}

export async function bookmarksExport(data: any) {
  return httpNav.post('/api/export', data, {
    timeout: 0,
  })
}

export async function getUserInfo(data?: Record<string, any>) {
  return httpNav.post('/api/info/get', data)
}

export async function updateUserInfo(data?: Record<string, any>) {
  return httpNav.post('/api/info/update', data)
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
