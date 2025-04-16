// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import config from '../../nav.config.json'
import http, { httpNav, getDefaultRequestData, getAddress } from '../utils/http'
import qs from 'qs'
import { encode } from 'js-base64'
import {
  settings,
  websiteList,
  tagList,
  getTagMap,
  searchEngineList,
  internal,
  component,
} from 'src/store'
import type { ISettings } from 'src/types'
import { isSelfDevelop } from 'src/utils/utils'
import { isLogin } from 'src/utils/user'
import { DB_PATH } from 'src/constants'
import {
  getIsGitee,
  getIsGitLab,
  removeTrailingSlashes,
} from 'src/utils/pureUtils'
import LZString from 'lz-string'
import event from 'src/utils/mitt'

const { gitRepoUrl, imageRepoUrl } = config
const s = gitRepoUrl.split('?')[0].split('/')
const DEFAULT_BRANCH = config.branch

export const authorName = s.at(-2)
export const repoName = s.at(-1)

export function getImageRepo() {
  let repo = repoName
  let branch = 'image'
  let projectId = getLabProjectId()
  if (imageRepoUrl) {
    const split = imageRepoUrl.split('?')
    repo = split[0].split('/').at(-1) || ''
    const query = qs.parse(split.at(-1) || '')
    if (query['branch']) {
      branch = query['branch'] as string
    }
    if (query['projectId']) {
      projectId = query['projectId'] as string
    }
  }
  return {
    repo,
    branch,
    projectId,
  } as const
}

function getLabProjectId() {
  const { projectId } = qs.parse(config.gitRepoUrl.split('?').at(-1) || '')
  return projectId
}

const isGitee = getIsGitee(config.gitRepoUrl)
const isGitLab = getIsGitLab(config.gitRepoUrl)

export function verifyToken(token: string) {
  const url = isSelfDevelop ? '/api/users/verify' : `/user`
  return http.get(url, {
    headers: {
      Authorization: `${isGitLab ? 'Bearer' : 'token'} ${token.trim()}`,
    },
  })
}

// 获取自有部署内容
export function getContentes() {
  return http
    .post('/api/contents/get', getDefaultRequestData())
    .then((res: any) => {
      websiteList.splice(0, websiteList.length)
      searchEngineList.splice(0, searchEngineList.length)
      tagList.splice(0, tagList.length)

      internal.loginViewCount = res.data.internal.loginViewCount
      internal.userViewCount = res.data.internal.userViewCount
      websiteList.push(...res.data.webs)
      tagList.push(...res.data.tags)
      searchEngineList.push(...res.data.search)
      const resSettings = res.data.settings as ISettings
      for (const k in resSettings) {
        // @ts-ignore
        settings[k] = resSettings[k]
      }
      for (const k in res.data.component) {
        // @ts-ignore
        component[k] = res.data.component[k]
      }
      getTagMap()
      event.emit('WEB_REFRESH')
      return res
    })
}

export function spiderWebs(data?: any) {
  let baseUrl = removeTrailingSlashes(getAddress())
  return fetch(`${baseUrl}/api/spider`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data }),
  })
}

export async function createBranch(branch: string) {
  if (isSelfDevelop) {
    return
  }
  if (imageRepoUrl) {
    return
  }

  const getUrl = () => {
    if (isGitee) {
      return `/repos/${authorName}/${repoName}/branches`
    } else if (isGitLab) {
      return `/projects/${getLabProjectId()}/repository/branches`
    } else {
      return `/repos/${authorName}/${repoName}/git/refs`
    }
  }
  const params: Record<string, any> = {}
  if (isGitee) {
    params['owner'] = `/${authorName}`
    params['repo'] = `/${authorName}/${repoName}`
    params['refs'] = DEFAULT_BRANCH
    params['branch_name'] = branch
  } else if (isGitLab) {
    params['ref'] = DEFAULT_BRANCH
    params['branch'] = branch
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
  return http.post(getUrl(), params)
}

export function getFileContent(path: string, branch: string = DEFAULT_BRANCH) {
  return http.get(`/repos/${authorName}/${repoName}/contents/${path}`, {
    params: {
      ref: branch,
    },
  })
}

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
    if (!isLogin) {
      return
    }
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

  if (path === DB_PATH) {
    content = LZString.compressToBase64(content)
  }
  const commitMessage = `rebot(CI): ${message}`
  const params: Record<string, any> = {
    branch,
    content: isEncode ? encode(content) : content,
  }
  if (isGitLab) {
    params['commit_message'] = commitMessage
    params['encoding'] = 'base64'
  } else {
    const fileInfo = await getFileContent(path, branch)
    params['message'] = commitMessage
    params['sha'] = fileInfo.data.sha
  }

  const url = isGitLab
    ? `/projects/${getLabProjectId()}/repository/files/${encodeURIComponent(
        path
      )}`
    : `/repos/${authorName}/${repoName}/contents/${path}`

  return http.put(url, params).then((res) => {
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

  const method = isGitee || isGitLab ? http.post : http.put
  const url = isGitLab
    ? `/projects/${
        getImageRepo().projectId
      }/repository/files/${encodeURIComponent(path)}`
    : `/repos/${authorName}/${getImageRepo().repo}/contents/${path}`
  const params: Record<string, any> = {
    branch,
    content: isEncode ? encode(content) : content,
  }
  const commitMessage = `rebot(CI): ${message}`
  if (isGitLab) {
    params['commit_message'] = commitMessage
    params['encoding'] = 'base64'
  } else {
    params['message'] = commitMessage
  }
  return method(url, params).then((res) => {
    requestActionUrl()
    return res
  })
}

export function getUserCollect(data?: Record<string, any>) {
  if (isSelfDevelop) {
    return http.post('/api/collect/get', data)
  }
  return httpNav.post('/api/get', data)
}

export function getUserCollectCount(data: Record<string, any> = {}) {
  data['showError'] = false
  if (isSelfDevelop) {
    return http.post('/api/collect/get', data)
  }
  return httpNav.post('/api/collect/count', data)
}

export function saveUserCollect(data?: Record<string, any>) {
  if (isSelfDevelop) {
    return http.post('/api/collect/save', data)
  }

  return httpNav.post('/api/save', data)
}

export function delUserCollect(data?: Record<string, any>) {
  if (isSelfDevelop) {
    return http.post('/api/collect/delete', data)
  }
  return httpNav.post('/api/delete', data)
}

export async function getWebInfo(url: string) {
  try {
    if (isSelfDevelop) {
      const res = await http.post('/api/web/info', { url })
      return {
        ...res.data,
      }
    }
    const res = await httpNav.post('/api/icon', { url })
    return {
      ...res.data,
    }
  } catch {
    return {}
  }
}

export function bookmarksExport(data: any) {
  return httpNav.post('/api/export', data, {
    timeout: 0,
  })
}

export function getIconBase64(data: any) {
  return httpNav.post('/api/base64', data, { timeout: 20000 })
}

export function getUserInfo(data?: Record<string, any>) {
  return httpNav.post('/api/info/get', data)
}

export function updateUserInfo(data?: Record<string, any>) {
  return httpNav.post('/api/info/update', data)
}

export function getTranslate(data?: Record<string, any>) {
  if (isSelfDevelop) {
    return http.post('/api/translate', getDefaultRequestData(data))
  }
  return httpNav.post('/api/translate', data)
}

export function getScreenshot(data?: Record<string, any>) {
  if (isSelfDevelop) {
    return http.post('/api/screenshot', getDefaultRequestData(data), {
      timeout: 0,
    })
  }
  return httpNav.post('/api/screenshot', data, {
    timeout: 0,
  })
}

export function getConfigInfo(data: Record<string, any> = {}) {
  return http.post('/api/config/get', data)
}

export function updateConfigInfo(data: Record<string, any> = {}) {
  return http.post('/api/config/update', data)
}

export function getNews(data: Record<string, any> = {}) {
  data['showError'] = false
  data['showLoading'] = false
  return httpNav.post('/api/news', data, {
    timeout: 0,
  })
}

export function getCDN(path: string) {
  const branch = getImageRepo().branch
  const repo = getImageRepo().repo
  if (isGitee) {
    return `https://gitee.com/${authorName}/${repo}/raw/${branch}/${path}`
  } else if (isGitLab) {
    return `https://gitlab.com/${authorName}/${repo}/-/raw/${branch}/${path}?ref_type=heads`
  }
  return `https://${settings.gitHubCDN}/gh/${authorName}/${repo}@${branch}/${path}`
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
