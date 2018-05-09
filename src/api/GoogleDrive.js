import CloudAPI from './CloudAPI'
import AX from '~/utils/ajax'
import googleDriveConfig from './configs/GoogleDrive.config'

const AUTH_TYPE = 'Bearer'

/**
 * @class
 * @extends CloudAPI
 * @classdesc Google Drive API abstaraction
 * @author Sergey Kobzev <jokernakartama@gmail.com>
 * @hideconstructor
 */
class GoogleDrive extends CloudAPI {
  static get settings () {
    return {
      winHeight: '600',
      winWidth: '800',
      clientId: googleDriveConfig.id,
      stateName: googleDriveConfig.name,
      redirectURI: googleDriveConfig.redirectURI,
      listLimit: 99999,
      tokenLifeTime: 3600
    }
  }

  static get urls () {
    return {
      authorize: {
        // https://developers.google.com/identity/protocols/OAuth2WebServer#creatingclient
        path: 'https://accounts.google.com/o/oauth2/v2/auth',
        params: {
          'scope': 'https://www.googleapis.com/auth/drive',
          'prompt': 'consent',
          'include_granted_scopes': 'true',
          'state': this.settings.stateName,
          'redirect_uri': this.settings.redirectURI,
          'response_type': 'token',
          'client_id': this.settings.clientId
        }
      },
      token: 'https://www.googleapis.com/oauth2/v4/token',
      checktoken: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
      revoke: null,
      // these two are different
      resourceMeta: 'https://www.googleapis.com/drive/v2/files/', // use ending slash if any parameters should be included in path
      filesList: 'https://www.googleapis.com/drive/v2/files', // this one uses query parameters in url
      download: 'https://www.googleapis.com/drive/v2/files/',
      publish: 'https://www.googleapis.com/drive/v2/files/',
      unpublish: 'https://www.googleapis.com/drive/v2/files/',
      delete: 'https://www.googleapis.com/drive/v2/files/',
      remove: 'https://www.googleapis.com/drive/v2/files/',
      makedir: 'https://www.googleapis.com/drive/v2/files',
      move: 'https://www.googleapis.com/drive/v2/files/',
      copy: 'https://www.googleapis.com/drive/v2/files/',
      restore: 'https://www.googleapis.com/drive/v2/files/',
      purge: 'https://www.googleapis.com/drive/v2/files/trash'
    }
  }

  static get names () {
    return {
      'limitUrlParamName': 'limit',
      'listKey': 'items',
      'listParentObject': null,
      'itemIdKey': 'id',
      'itemTypeKey': 'mimeType',
      'itemDirKey': 'application/vnd.google-apps.folder',
      'itemPublicUrlKey': 'alternateLink',
      'itemPreviewKey': 'thumbnailLink',
      'itemIsSharedKey': 'shared',
      'itemNameKey': 'title',
      'itemModifiedKey': 'modifiedDate',
      'itemSizeKey': 'quotaBytesUsed',
      'itemParentIsRootKey': 'isRoot',
      'rootPathIdentifier': 'root'
    }
  }

  static isDir (item) {
    return item[this.names.itemTypeKey] === this.names.itemDirKey
  }
  static isFile (item) {
    return !this.isDir(item)
  }
  static isList (rawResponse) {
    return this.names.listKey in rawResponse
  }
  static isRoot (rawData) {
    return rawData.parents.length === 0
  }
  static isShared (rawData) {
    // i prefer to return empirically obtained link than the "alternateLink" key value,
    // because sometimes it rather refer to Google Docs than viewer
    return (rawData[this.names.itemIsSharedKey] ? 'https://drive.google.com/file/d/' + rawData[this.names.itemIdKey] + '/view' : null)
  }
  static getParent (rawData) {
    if (rawData.parents && rawData.parents.length) {
      if (rawData.parents[0][this.names.itemParentIsRootKey]) {
        return ''
      } else {
        return rawData.parents[0][this.names.itemIdKey]
      }
    } else {
      return null
    }
  }
  static getItemPath (item) {
    return item.id
  }

  /**
   * Validates token before using it
   * @see {@link https://developers.google.com/identity/protocols/OAuth2UserAgent#validate-access-token}
   */
  static getToken (data, callback = () => {}, error = () => {}) {
    if (!data.token || data.error !== null) {
      error(data)
    } else {
      AX.get(this.urls.checktoken, {'access_token': data.token})
        .headers()
        .status({
          'success': 200,
          'error': 400
        })
        .on('success', (body) => {
          data['expires_in'] = body['expires_in']
          if (typeof callback === 'function') callback(data)
        })
        .on('error', (body) => {
          if (typeof error === 'function') error(body)
        })
        .send()
    }
  }

  // API methods
  /**
   * As Google Drive api uses one way to change various resource
   * parameters we use the method in tasks
   * @see {@link https://developers.google.com/drive/v2/reference/files/patch}
   */
  static updateResource (id, data, func = {}) {
    AX.put(this.urls.resourceMeta + id)
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
      .send.json(data)
    return false
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/insert}
   */
  static makeDir (parentId, dirName, func) {
    var jsonData = {
      'title': dirName,
      'mimeType': 'application/vnd.google-apps.folder',
      'parents': [
        {
          'id': parentId
        }
      ]
    }
    AX.post(this.urls.makedir)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        var dirMeta = this.serialize(body)
        if (typeof func.success === 'function') func.success(dirMeta, resp)
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
      .send.json(jsonData)
    return false
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/get}
   */
  static getResource (id, func = {}, params = {}) {
    AX.get(this.urls.resourceMeta + id, params)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': [200, 304],
        'error': 404,
        'fail': ['!404', '!200', '!304'],
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
   * @see GoogleDrive.getResource
   */
  static getResourceMeta (id, func = {}) {
    if (id === '' || id === '/') id = this.names.rootPathIdentifier
    var params = {
      fields: 'id,title,parents,mimeType'
    }
    var success = func.success
    var callbacks = Object.assign({}, func, {
      success: (body, resp) => {
        var resourceMeta = this.serialize(body)
        if (typeof success === 'function') success(resourceMeta, resp)
      }
    })
    this.getResource(id, callbacks, params)
    return false
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/list}
   */
  static getResourceList (id, func = {}, trash = false) {
    // normalize root id
    if (id === '' || id === '/') id = this.names.rootPathIdentifier
    var urlParams = {
      'orderBy': this.names.itemNameKey
    }
    if (trash) {
      urlParams['q'] = 'trashed=true'
    } else {
      urlParams['q'] = '\'' + id + '\' in parents and trashed=false'
    }
    AX.get(this.urls.filesList, urlParams)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': [200, 304],
        'error': 404,
        'fail': ['!404', '!200', '!304'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        var list = this.serialize(body)
        if (typeof func.success === 'function') func.success(list, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see GoogleDrive.getResource
   */
  static getDownloadLink (id, func = {}) {
    var success = func.success
    var callback = Object.assign({}, func, {
      success: (body, resp) => {
        if (this.isFile(body) && !!body['webContentLink']) {
          let href = body['webContentLink']
          if (typeof success === 'function') success(href, resp)
        }
      }
    })
    this.getResource(id, callback, {
      fields: 'webContentLink,title,mimeType'
    })
  }

  /**
   * @see GoogleDrive.getResource
   */
  static getPublicLink (item, func = {}) {
    var success = func.success
    var callback = Object.assign({}, func, {
      success: (body, resp) => {
        var publicUrl = body[this.names.itemPublicUrlKey]
        if (typeof success === 'function') success(publicUrl, resp)
      }
    })
    this.getResource(item, callback, {
      fields: this.names.itemPublicUrlKey
    })
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/permissions/insert}
   */
  static publishResource (id, func = {}) {
    var data = {
      role: 'reader',
      type: 'anyone',
      withLink: true
    }
    var success = func.success
    var publicUrl
    var callback = Object.assign({}, func, {
      success: (url, resp) => {
        publicUrl = url
        if (typeof success === 'function') success(publicUrl, resp)
      }
    })
    AX.post(this.urls.publish + id + '/permissions')
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': '!200'
      })
      .on('success', () => {
        this.getPublicLink(id, callback)
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
      .send.json(data)
    return false
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/permissions/delete}
   */
  static unpublishResource (id, func = {}) {
    AX.delete(this.urls.unpublish + id + '/permissions/anyoneWithLink')
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 204,
        'error': 404,
        'fail': ['!404', '!204'],
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
   * @see {@link https://developers.google.com/drive/v2/reference/files/trash}
   */
  static removeResource (id, func = {}, params = {}) {
    if (params); // ignore as not used
    AX.post(this.urls.remove + id + '/trash')
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
   * @see {@link https://developers.google.com/drive/v2/reference/files/delete}
   */
  static deleteResource (id, func = {}) {
    AX.delete(this.urls.delete + id)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 204,
        'error': 404,
        'fail': ['!404', '!204'],
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
   * @see GoogleDrive.updateResource
   */
  static renameResource (id, newname, func = {}) {
    var data = {
      'title': newname
    }
    var success = func.success
    var callback = Object.assign({}, func, {
      success: (body, resp) => {
        var resourceMeta = this.serialize(body)
        if (typeof success === 'function') success(resourceMeta, resp)
      }
    })
    this.updateResource(id, data, callback)
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/copy}
   */
  static copyResourceTo (id, destination, func = {}) {
    if (destination === '' || destination === '/') destination = this.names.rootPathIdentifier
    var title
    var callback = Object.assign({}, func, {
      success: (body) => {
        // Google Drive renames copies as `Copy of "Filename"` by default
        // so we have to get the original name initially
        title = body[this.names.itemNameKey]
        var data = {
          'parents': [{'id': destination}],
          'title': title
        }
        AX.post(this.urls.copy + id + '/copy')
          .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
          .status({
            'success': 200,
            'error': 404,
            'fail': ['!404', '!200'],
            'anyway': 'all'
          })
          .on('success', (body, resp) => {
            var resourceMeta = this.serialize(body)
            if (typeof func.success === 'function') func.success(resourceMeta, resp)
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
          .send.json(data)
      },
      anyway: (body, resp) => {
        if (typeof func.anyway === 'function' && !title) func.anyway(body, resp)
      }
    })
    this.getResource(id, callback, {
      fields: this.names.itemNameKey
    })
    return false
  }

  /**
   * @see GoogleDrive.updateResource
   */
  static moveResourceTo (id, destination, func = {}, overwrite = false) {
    if (destination === '' || destination === '/') destination = this.names.rootPathIdentifier
    if (overwrite); // Google Drive resources are id-based so they cannot be overwritten
    var data = {
      'parents': [
        {
          'id': destination
        }
      ]
    }
    var success = func.success
    var callback = Object.assign({}, func, {
      success: (body, resp) => {
        var resourceMeta = this.serialize(body)
        if (typeof success === 'function') success(resourceMeta, resp)
      }
    })
    this.updateResource(id, data, callback)
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/untrash}
   */
  static restoreResource (id, func = {}, overwrite = false) {
    if (overwrite); // ignore as not uset
    AX.post(this.urls.remove + id + '/untrash')
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
   * @see {@link https://developers.google.com/drive/v2/reference/files/emptyTrash}
   */
  static purgeTrash (func = {}) {
    AX.delete(this.urls.purge)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 204,
        'fail': '!204',
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

export default GoogleDrive
