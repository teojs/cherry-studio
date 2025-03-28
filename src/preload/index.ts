import type { ExtractChunkData } from '@cherrystudio/embedjs-interfaces'
import { electronAPI } from '@electron-toolkit/preload'
import { FileType, KnowledgeBaseParams, KnowledgeItem, MCPServer, Shortcut, WebDavConfig } from '@types'
import { contextBridge, ipcRenderer, OpenDialogOptions, shell } from 'electron'
import { CreateDirectoryOptions } from 'webdav'

// Custom APIs for renderer
const api = {
  getAppInfo: () => ipcRenderer.invoke('app:info'),
  reload: () => ipcRenderer.invoke('app:reload'),
  setProxy: (proxy: string) => ipcRenderer.invoke('app:proxy', proxy),
  checkForUpdate: () => ipcRenderer.invoke('app:check-for-update'),
  showUpdateDialog: () => ipcRenderer.invoke('app:show-update-dialog'),
  setLanguage: (lang: string) => ipcRenderer.invoke('app:set-language', lang),
  setLaunchOnBoot: (isActive: boolean) => ipcRenderer.invoke('app:set-launch-on-boot', isActive),
  setLaunchToTray: (isActive: boolean) => ipcRenderer.invoke('app:set-launch-to-tray', isActive),
  setTray: (isActive: boolean) => ipcRenderer.invoke('app:set-tray', isActive),
  setTrayOnClose: (isActive: boolean) => ipcRenderer.invoke('app:set-tray-on-close', isActive),
  restartTray: () => ipcRenderer.invoke('app:restart-tray'),
  setTheme: (theme: 'light' | 'dark') => ipcRenderer.invoke('app:set-theme', theme),
  openWebsite: (url: string) => ipcRenderer.invoke('open:website', url),
  minApp: (url: string) => ipcRenderer.invoke('minapp', url),
  clearCache: () => ipcRenderer.invoke('app:clear-cache'),
  system: {
    getDeviceType: () => ipcRenderer.invoke('system:getDeviceType')
  },
  zip: {
    compress: (text: string) => ipcRenderer.invoke('zip:compress', text),
    decompress: (text: Buffer) => ipcRenderer.invoke('zip:decompress', text)
  },
  backup: {
    backup: (fileName: string, data: string, destinationPath?: string) =>
      ipcRenderer.invoke('backup:backup', fileName, data, destinationPath),
    restore: (backupPath: string) => ipcRenderer.invoke('backup:restore', backupPath),
    backupToWebdav: (data: string, webdavConfig: WebDavConfig) =>
      ipcRenderer.invoke('backup:backupToWebdav', data, webdavConfig),
    restoreFromWebdav: (webdavConfig: WebDavConfig) => ipcRenderer.invoke('backup:restoreFromWebdav', webdavConfig),
    listWebdavFiles: (webdavConfig: WebDavConfig) => ipcRenderer.invoke('backup:listWebdavFiles', webdavConfig),
    checkConnection: (webdavConfig: WebDavConfig) => ipcRenderer.invoke('backup:checkConnection', webdavConfig),
    createDirectory: (webdavConfig: WebDavConfig, path: string, options?: CreateDirectoryOptions) =>
      ipcRenderer.invoke('backup:createDirectory', webdavConfig, path, options)
  },
  file: {
    select: (options?: OpenDialogOptions) => ipcRenderer.invoke('file:select', options),
    upload: (filePath: string) => ipcRenderer.invoke('file:upload', filePath),
    delete: (fileId: string) => ipcRenderer.invoke('file:delete', fileId),
    read: (fileId: string) => ipcRenderer.invoke('file:read', fileId),
    clear: () => ipcRenderer.invoke('file:clear'),
    get: (filePath: string) => ipcRenderer.invoke('file:get', filePath),
    create: (fileName: string) => ipcRenderer.invoke('file:create', fileName),
    write: (filePath: string, data: Uint8Array | string) => ipcRenderer.invoke('file:write', filePath, data),
    open: (options?: { decompress: boolean }) => ipcRenderer.invoke('file:open', options),
    openPath: (path: string) => ipcRenderer.invoke('file:openPath', path),
    save: (path: string, content: string, options?: { compress: boolean }) =>
      ipcRenderer.invoke('file:save', path, content, options),
    selectFolder: () => ipcRenderer.invoke('file:selectFolder'),
    saveImage: (name: string, data: string) => ipcRenderer.invoke('file:saveImage', name, data),
    base64Image: (fileId: string) => ipcRenderer.invoke('file:base64Image', fileId),
    download: (url: string) => ipcRenderer.invoke('file:download', url),
    copy: (fileId: string, destPath: string) => ipcRenderer.invoke('file:copy', fileId, destPath),
    binaryFile: (fileId: string) => ipcRenderer.invoke('file:binaryFile', fileId)
  },
  fs: {
    read: (path: string) => ipcRenderer.invoke('fs:read', path)
  },
  export: {
    toWord: (markdown: string, fileName: string) => ipcRenderer.invoke('export:word', markdown, fileName)
  },
  openPath: (path: string) => ipcRenderer.invoke('open:path', path),
  shortcuts: {
    update: (shortcuts: Shortcut[]) => ipcRenderer.invoke('shortcuts:update', shortcuts)
  },
  knowledgeBase: {
    create: (base: KnowledgeBaseParams) => ipcRenderer.invoke('knowledge-base:create', base),
    reset: (base: KnowledgeBaseParams) => ipcRenderer.invoke('knowledge-base:reset', base),
    delete: (id: string) => ipcRenderer.invoke('knowledge-base:delete', id),
    add: ({
      base,
      item,
      forceReload = false
    }: {
      base: KnowledgeBaseParams
      item: KnowledgeItem
      forceReload?: boolean
    }) => ipcRenderer.invoke('knowledge-base:add', { base, item, forceReload }),
    remove: ({ uniqueId, uniqueIds, base }: { uniqueId: string; uniqueIds: string[]; base: KnowledgeBaseParams }) =>
      ipcRenderer.invoke('knowledge-base:remove', { uniqueId, uniqueIds, base }),
    search: ({ search, base }: { search: string; base: KnowledgeBaseParams }) =>
      ipcRenderer.invoke('knowledge-base:search', { search, base }),
    rerank: ({ search, base, results }: { search: string; base: KnowledgeBaseParams; results: ExtractChunkData[] }) =>
      ipcRenderer.invoke('knowledge-base:rerank', { search, base, results })
  },
  window: {
    setMinimumSize: (width: number, height: number) => ipcRenderer.invoke('window:set-minimum-size', width, height),
    resetMinimumSize: () => ipcRenderer.invoke('window:reset-minimum-size')
  },
  gemini: {
    uploadFile: (file: FileType, apiKey: string) => ipcRenderer.invoke('gemini:upload-file', file, apiKey),
    base64File: (file: FileType) => ipcRenderer.invoke('gemini:base64-file', file),
    retrieveFile: (file: FileType, apiKey: string) => ipcRenderer.invoke('gemini:retrieve-file', file, apiKey),
    listFiles: (apiKey: string) => ipcRenderer.invoke('gemini:list-files', apiKey),
    deleteFile: (apiKey: string, fileId: string) => ipcRenderer.invoke('gemini:delete-file', apiKey, fileId)
  },
  selectionMenu: {
    action: (action: string) => ipcRenderer.invoke('selection-menu:action', action)
  },
  config: {
    set: (key: string, value: any) => ipcRenderer.invoke('config:set', key, value),
    get: (key: string) => ipcRenderer.invoke('config:get', key)
  },
  miniWindow: {
    show: () => ipcRenderer.invoke('miniwindow:show'),
    hide: () => ipcRenderer.invoke('miniwindow:hide'),
    close: () => ipcRenderer.invoke('miniwindow:close'),
    toggle: () => ipcRenderer.invoke('miniwindow:toggle')
  },
  aes: {
    encrypt: (text: string, secretKey: string, iv: string) => ipcRenderer.invoke('aes:encrypt', text, secretKey, iv),
    decrypt: (encryptedData: string, iv: string, secretKey: string) =>
      ipcRenderer.invoke('aes:decrypt', encryptedData, iv, secretKey)
  },
  mcp: {
    removeServer: (server: MCPServer) => ipcRenderer.invoke('mcp:remove-server', server),
    listTools: (server: MCPServer) => ipcRenderer.invoke('mcp:list-tools', server),
    callTool: ({ server, name, args }: { server: MCPServer; name: string; args: any }) =>
      ipcRenderer.invoke('mcp:call-tool', { server, name, args }),
    getInstallInfo: () => ipcRenderer.invoke('mcp:get-install-info')
  },
  shell: {
    openExternal: shell.openExternal
  },
  copilot: {
    getAuthMessage: (headers?: Record<string, string>) => ipcRenderer.invoke('copilot:get-auth-message', headers),
    getCopilotToken: (device_code: string, headers?: Record<string, string>) =>
      ipcRenderer.invoke('copilot:get-copilot-token', device_code, headers),
    saveCopilotToken: (access_token: string) => ipcRenderer.invoke('copilot:save-copilot-token', access_token),
    getToken: (headers?: Record<string, string>) => ipcRenderer.invoke('copilot:get-token', headers),
    logout: () => ipcRenderer.invoke('copilot:logout'),
    getUser: (token: string) => ipcRenderer.invoke('copilot:get-user', token)
  },

  // Binary related APIs
  isBinaryExist: (name: string) => ipcRenderer.invoke('app:is-binary-exist', name),
  getBinaryPath: (name: string) => ipcRenderer.invoke('app:get-binary-path', name),
  installUVBinary: () => ipcRenderer.invoke('app:install-uv-binary'),
  installBunBinary: () => ipcRenderer.invoke('app:install-bun-binary'),
  protocol: {
    onReceiveData: (callback: (data: { url: string; params: any }) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, data: { url: string; params: any }) => {
        callback(data)
      }
      ipcRenderer.on('protocol-data', listener)
      return () => {
        ipcRenderer.off('protocol-data', listener)
      }
    }
  },
  nutstore: {
    getSSOUrl: () => ipcRenderer.invoke('nutstore:get-sso-url'),
    decryptToken: (token: string) => ipcRenderer.invoke('nutstore:decrypt-token', token),
    getDirectoryContents: (token: string, path: string) =>
      ipcRenderer.invoke('nutstore:get-directory-contents', token, path)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('obsidian', {
      getVaults: () => ipcRenderer.invoke('obsidian:get-vaults'),
      getFolders: (vaultName: string) => ipcRenderer.invoke('obsidian:get-files', vaultName),
      getFiles: (vaultName: string) => ipcRenderer.invoke('obsidian:get-files', vaultName)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
