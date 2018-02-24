type optional = string|null
type AjaxResponseCallback =  (b?: any, r?: any) => void
type SerializedResource = object

interface IMethodCallback {
  success: AjaxResponseCallback
  error?: AjaxResponseCallback
  exist?: AjaxResponseCallback
  fail?: AjaxResponseCallback
  anyway?: AjaxResponseCallback
}

interface IDirResource {
  id: string
  name: string
  parent: optional
  isRoot: boolean
  type: string
  path: string
  publicLink: optional
}

interface IFileResource {
  id: string
  name: string
  modified: string
  type: string
  size: number
  path: string
  preview: optional
  publicLink: optional
}

interface ICloudAPI {
  settings: () => object
  urls: () => object
  names: () => object
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
  getFilesList: (id: string, cb?: IMethodCallback, trash?: boolean) => void
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
  saveTokenData: (data?: object, cb?: () => void) => void
  revokeAuthorization: (cb?: () => void) => void
  [anyMethod: string]: (...args: any[]) => any
}
