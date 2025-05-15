export async function unregisterServiceWorkers(): Promise<boolean> {
  try {
    // 卸载所有Service Worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()

      console.log(`找到 ${registrations.length} 个Service Worker注册`)

      for (const registration of registrations) {
        await registration.unregister()
        console.log('成功卸载Service Worker:', registration.scope)
      }
    }

    // 清理所有缓存
    if ('caches' in window) {
      const cacheNames = await caches.keys()

      console.log(`找到 ${cacheNames.length} 个缓存`)

      for (const cacheName of cacheNames) {
        await caches.delete(cacheName)
        console.log('成功删除缓存:', cacheName)
      }
    }

    return true
  } catch (error) {
    console.error('清理Service Worker失败:', error)
    return false
  }
}

export function isPwaMode(): boolean {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches
  const isIOSStandalone =
    'standalone' in navigator && (navigator.standalone as boolean)
  return isStandalone || isFullscreen || isMinimalUI || isIOSStandalone
}
