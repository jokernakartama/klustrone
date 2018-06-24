type optional = string|null
type AjaxResponseCallback =  (b?: any, r?: any) => void
type SerializedResource = object
type token = ITokenData|boolean

interface IMethodCallback {
  success: AjaxResponseCallback
  error?: AjaxResponseCallback
  exist?: AjaxResponseCallback
  fail?: AjaxResponseCallback
  anyway?: AjaxResponseCallback
}

interface ITokenData {
  token: string
  error?: any
  state?: string
  expires_at?: number
  expires_in: number
}
interface IDirResource {
  id: string
  name: string
  parent: optional
  isRoot: boolean
  type: string
  path: string
  size?: number
  preview?: optional 
  publicLink: optional
}

interface IFileResource {
  id: string
  name: string
  modified: string
  type: string
  size?: number
  path: string
  preview: optional
  publicLink: optional
}

interface IAPIurls {
  (): string|object
  authorize: {
    path: string
    params: object
  }
  [otherUrls: string]: string|object
}

interface IAPInames {
  (): any
  [otherNames: string]: string
}

interface IAPISettings {
  (): any
  [otherSettings: string]: any
}

interface ICloudAPI {
  settings: () => IAPISettings
  urls: () => IAPIurls
  names: () => IAPInames
  isDir: (item: object) => boolean
  isFile: (item: object) => boolean
  isList: (resp: object) => boolean
  isRoot: (data: object) => boolean
  isShared: (data: object) => optional
  getItemPath: (item: object) => optional
  getParent: (data: object) => optional
  getPreview: (data: object) => optional
  parseDir: (data: object) => IDirResource
  parseFile: (data: object) => IFileResource
  serialize: (data: object) => SerializedResource
  makeDir: (id: string, name: string, cb?: IMethodCallback) => void
  getResourceMeta: (id: string, cb?: IMethodCallback, p?: object) => void
  getResource: (id: string, cb?: IMethodCallback, trash?: boolean) => void
  getResourceList: (id: string, cb?: IMethodCallback, trash?: boolean) => void
  getDownloadLink: (id: string, cb?: IMethodCallback) => void
  publishResource: (id: string, cb?: IMethodCallback) => void
  unpublishResource: (id: string, cb?: IMethodCallback) => void
  getPublicLink: (id: string, cb?: IMethodCallback) => void
  removeResource: (id: string, cb?: IMethodCallback, p?: object) => void
  deleteResource: (id: string, cb?: IMethodCallback) => void
  renameResource: (id: string, name: string, cb?: IMethodCallback) => void
  copyResourceTo: (id: string, path: string, cb?: IMethodCallback) => void
  moveResourceTo: (id: string, path: string, cb?: IMethodCallback) => void
  restoreResource: (id: string, cb?: IMethodCallback, overwrite?: boolean) => void
  purgeTrash: (cb?: IMethodCallback) => void
  postCode: () => boolean
  openAuthWindow: (data?: any, window?: Window) => void
  getToken: (data: object, cb?: () => void, err?: () => void) => void
  saveTokenData: (data?: token, cb?: (data?: token) => void) => void
  revokeAuthorization: (cb?: () => void) => void
  [anyMethod: string]: (...args: any[]) => any
}

interface IServiceMap {
  [serviceName: string]: ICloudAPI
}
