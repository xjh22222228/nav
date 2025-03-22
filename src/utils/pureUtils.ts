import { ISettings } from '../types'

export function replaceJsdelivrCDN(
  url: string = '',
  settings: ISettings
): string {
  const cdn = settings?.gitHubCDN
  if (!cdn) {
    return url
  }
  url = url.replace('cdn.jsdelivr.net', cdn)
  url = url.replace('testingcf.jsdelivr.net', cdn)
  url = url.replace('img.jsdmirror.com', cdn)
  url = url.replace('gcore.jsdelivr.net', cdn)
  return url
}

export function getIsGitee(gitRepoUrl: string): boolean {
  return gitRepoUrl.includes('gitee.com')
}

export function removeTrailingSlashes(url: string | null | undefined): string {
  if (!url) {
    return ''
  }
  return url.replace(/\/+$/, '')
}
