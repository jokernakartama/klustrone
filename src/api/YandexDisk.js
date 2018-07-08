import CloudAPI from './CloudAPI'
import AX from '~/utils/ajax'
import { default as pathJoin, dirname, getNameFromPath } from '~/utils/path.join'
import yandexDiskConfig from './configs/YandexDisk.config'

const AUTH_TYPE = 'OAuth'
/**
 * @class
 * @extends CloudAPI
 * @classdesc Yandex Disk API abstaraction
 * @author Sergey Kobzev <jokernakartama@gmail.com>
 * @hideconstructor
 */
class YandexDisk extends CloudAPI {
  static get settings () {
    return {
      winHeight: '600',
      winWidth: '800',
      clientId: yandexDiskConfig.id,
      stateName: yandexDiskConfig.name,
      listLimit: 99999,
      // minimal timeout before next checking an acync operation status
      asyncDelay: 500
    }
  }

  static get urls () {
    return {
      authorize: {
        path: 'https://oauth.yandex.ru/authorize',
        params: {
          'response_type': 'token',
          'client_id': this.settings.clientId,
          'force_confirm': 1,
          'state': this.settings.stateName
        }
      },
      token: 'https://oauth.yandex.ru/token',
      revoke: null,
      resourceMeta: 'https://cloud-api.yandex.net:443/v1/disk/resources',
      filesList: 'https://cloud-api.yandex.net:443/v1/disk/resources',
      trashList: 'https://cloud-api.yandex.net:443/v1/disk/trash/resources',
      download: 'https://cloud-api.yandex.net:443/v1/disk/resources/download',
      publish: 'https://cloud-api.yandex.net:443/v1/disk/resources/publish',
      unpublish: 'https://cloud-api.yandex.net:443/v1/disk/resources/unpublish',
      delete: 'https://cloud-api.yandex.net:443/v1/disk/resources',
      remove: 'https://cloud-api.yandex.net:443/v1/disk/resources',
      makedir: 'https://cloud-api.yandex.net:443/v1/disk/resources',
      move: 'https://cloud-api.yandex.net:443/v1/disk/resources/move',
      copy: 'https://cloud-api.yandex.net:443/v1/disk/resources/copy',
      restore: 'https://cloud-api.yandex.net:443/v1/disk/trash/resources/restore',
      purge: 'https://cloud-api.yandex.net:443/v1/disk/trash/resources'
    }
  }

  static get names () {
    return {
      'pathQueryPrefix': '/',
      'limitUrlParamName': 'limit',
      'listKey': 'items',
      'listParentObject': '_embedded',
      'itemIdKey': 'resource_id',
      'itemTypeKey': 'type',
      'itemDirKey': 'dir',
      'itemPublicUrlKey': 'public_url',
      'itemPreviewKey': 'preview',
      'itemFileKey': 'file',
      'itemNameKey': 'name',
      'itemModifiedKey': 'modified',
      'itemSizeKey': 'size',
      'rootPathIdentifier': '/'
    }
  }

  static isDir (item) {
    return item[this.names.itemTypeKey] === this.names.itemDirKey
  }
  static isFile (item) {
    return item[this.names.itemTypeKey] === this.names.itemFileKey
  }
  static isList (rawResponse) {
    return this.names.listKey in rawResponse
  }
  static isRoot (rawData) {
    var itemPath = this.getItemPath(rawData)
    return itemPath === '/' || itemPath === ''
  }
  static isShared (rawData) {
    return rawData[this.names.itemPublicUrlKey] || null
  }
  static getParent (rawData) {
    var itemPath = this.getItemPath(rawData)
    var parent
    if (this.isRoot(rawData)) {
      parent = null
    } else {
      // just cut off directory name with a beginning slash
      parent = itemPath.slice(0, -rawData.name.length - 1)
    }
    return parent
  }
  static getItemPath (item) {
    return item.path.slice(6) // cut the "disk:/" prefix
  }

  /**
   * As query path of parsed resource has no slash at start,
   * this method makes right path for api query.
   * @param path {string} Parsed resource query path (generally with no slash at start)
   */
  static createPath (path) {
    if (path === '') return this.names.rootPathIdentifier
    if (path.slice(0, 1) === '/') {
      return path
    } else {
      return this.names.pathQueryPrefix + path
    }
  }

  /**
   * Does nothing except error handling
   */
  static getToken (data, callback = () => {}, error = () => {}) {
    if (!data.token || data.error !== null) {
      error(data)
    } else {
      callback(data)
    }
  }

  // API methods

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/CreateResource}
   */
  static makeDir (parentPath, dirName, func = {}) {
    var destination = pathJoin(parentPath, dirName)
    var urlParams = {path: this.createPath(destination)}
    var success = func.success
    var dirMeta
    var callback = Object.assign({}, func, {
      success: (body, resp) => {
        dirMeta = this.serialize(body)
        if (typeof success === 'function') success(dirMeta, resp)
      }
    })
    AX.put(this.urls.makedir, urlParams)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 201,
        'error': 404,
        'exist': 409,
        'fail': ['!404', '!201', '!409'],
        'anyway': '!201'
      })
      .on('success', () => {
        this.getResource(destination, callback)
      })
      .on('exist', (body, resp) => {
        if (typeof func.exist === 'function') func.exist(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/GetResource}
   */
  static getResource (path, func = {}, params = {}) {
    params['path'] = this.createPath(path)
    AX.get(this.urls.resourceMeta, params)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see YandexDisk.getResource
   */
  static getResourceMeta (path, func = {}) {
    path = this.createPath(path)
    var params = {
      fields: 'name,modified,created,path,type'
    }
    var success = func.success
    var callbacks = Object.assign({}, func, {
      success: (body, resp) => {
        var resourceMeta = this.serialize(body)
        if (typeof success === 'function') success(resourceMeta, resp)
      }
    })
    this.getResource(path, callbacks, params)
    return false
  }

  static getResourceList (path, func = {}, trash = false) {
    path = this.createPath(path)
    var url = trash ? this.urls.trashList : this.urls.filesList
    var urlParams = {}
    urlParams['fields'] = this.names.listParentObject
    urlParams[this.names.limitUrlParamName] = this.settings.listLimit
    urlParams['path'] = trash ? '/' : path
    AX.get(url, urlParams)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        var list = this.serialize(body[this.names.listParentObject])
        if (typeof func.success === 'function') func.success(list, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/GetResourceDownloadLink}
   */
  static getDownloadLink (path, func = {}) {
    AX.get(this.urls.download, {path: this.createPath(path)})
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        var href = body.href
        if (typeof func.success === 'function') func.success(href, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  static getPublicLink (path, func = {}) {
    this.getResource(path, func, {fields: this.names.itemPublicUrlKey})
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/PublishResource}
   */
  static publishResource (path, func = {}) {
    var urlParams = {path: this.createPath(path)}
    var success = func.success
    var publicUrl
    var callback = Object.assign({}, func, {
      success: (body, resp) => {
        publicUrl = body[this.names.itemPublicUrlKey]
        if (typeof success === 'function') success(publicUrl, resp)
      }
    })
    AX.put(this.urls.publish, urlParams)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': '!200' // as we use a nested request in getPublicLink if this one is succeed, this callback should not run multiple times
      })
      .on('success', () => {
        this.getPublicLink(path, callback)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send.text()
    return false
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/UnpublishResource}
   */
  static unpublishResource (path, func) {
    var urlParams = {path: this.createPath(path)}
    AX.put(this.urls.unpublish, urlParams)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (body);
        const data = this.isShared({ [this.names.itemPublicUrlKey]: false })
        if (typeof func.success === 'function') func.success(data, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/DeleteResource}
   */
  static removeResource (path, func, urlParams = {}) {
    urlParams = Object.assign(urlParams, {path: this.createPath(path)})
    AX.delete(this.urls.remove, urlParams)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 204,
        'async': 202,
        'error': 404,
        'fail': ['!404', '!202', '!204'],
        'anyway': 'all'
      })
      .on('async', (body) => {
        this.getAsyncState (body.href, func)
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/DeleteResource}
   */
  static deleteResource (path, func) {
    this.removeResource(path, func, {permanently: true, force_async: true})
  }

  static getAsyncState (url, func = {}) {
    AX.get(url)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (body.status === 'in-progress') {
          const newRequest = () => this.getAsyncState (url, func)
          window.setTimeout(newRequest, this.settings.asyncDelay)
        } else {
          if (typeof func.success === 'function') func.success(body, resp)
        }
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
  }

  static copyOrMove (copy, currentPath, destination, func) {
    // As the only urls are different, this method is common for both actions
    var url = copy ? this.urls.copy : this.urls.move
    var urlParams = {
      from: this.createPath(currentPath),
      path: this.createPath(destination),
      force_async: true,
      overwrite: false
    }
    AX.post(url, urlParams)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 201,
        'async': 202,
        'error': 404,
        'exist': 409,
        'fail': ['!404', '!201', '!409'],
        'anyway': 'all'
      })
      .on('async', (body) => {
        this.getAsyncState (body.href, func)
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('exist', (body, resp) => {
        if (typeof func.error === 'function' && body.error === 'DiskPathDoesntExistsError') {
          // Yandex Disk does not return 404 code if the resource does not exists.
          func.error(body, resp)
        } else if (typeof func.exist === 'function') {
          func.exist(body, resp)
        }
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * This method is like YandexDisk.moveResourceTo
   */
  static renameResource (resourcePath, newname, func) {
    var parent = dirname(resourcePath)
    var destination = pathJoin(parent, newname)
    var success = func.success
    var anyway = func.anyway
    var isSucceed = false
    var dataCallback = Object.assign({}, func, {
      success: (body, resp) => {
        isSucceed = true
        var meta = this.serialize(body)
        if (typeof success === 'function') success(meta, resp)
      }
    })
    var actionCallback = Object.assign({}, func, {
      success: () => {
        this.getResource(destination, dataCallback)
      },
      anyway: (body, resp) => {
        if (typeof anyway === 'function' && !isSucceed) anyway(body, resp)
      }
    })
    this.copyOrMove(false, resourcePath, destination, actionCallback)
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/CopyResource}
   */
  static copyResourceTo (path, destination, func = {}) {
    var resourceName = getNameFromPath(path)
    var newPath = pathJoin(destination, resourceName)
    this.copyOrMove(true, path, newPath, func)
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/MoveResource}
   */
  static moveResourceTo (path, destination, func = {}) {
    var resourceName = getNameFromPath(path)
    var newPath = pathJoin(destination, resourceName)
    this.copyOrMove(false, path, newPath, func)
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/trash/resources/RestoreFromTrash}
   */
  static restoreResource (path, func = {}, overwrite = false) {
    var urlParams = {
      path: this.createPath(path),
      overwrite: overwrite
    }
    AX.put(this.urls.restore, urlParams)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': [201, 202],
        'error': 404,
        'exist': 409,
        'fail': ['!404', '!201', '!409'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('exist', (body, resp) => {
        if (typeof func.exist === 'function') func.exist(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/trash/resources/ClearTrash}
   */
  static purgeTrash (func = {}) {
    AX.delete(this.urls.purge)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': [202, 204],
        'fail': ['!202', '!204'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
  }
}

export default YandexDisk
