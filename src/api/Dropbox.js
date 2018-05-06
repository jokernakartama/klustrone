import Promise from 'promise-polyfill'
import CloudAPI from './CloudAPI'
import AX from '~/utils/ajax'
import { default as pathJoin, dirname, getNameFromPath } from '~/utils/path.join'
import DropboxConfig from './configs/Dropbox.config'

const AUTH_TYPE = 'Bearer'

const ROOT_DIR_DATA = {
  '.tag': 'folder',
  'name': 'dropbox_root',
  'path_lower': '',
  'path_display': ''
}

const ROOT_DIR_RESPONSE = {
  body: ROOT_DIR_DATA,
  statusCode: 200,
  method: 'post',
  headers: {
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'pragma': 'no-cache'
  },
  url: 'https://api.dropboxapi.com/2/files/get_metadata'
}

/**
 * @class
 * @extends CloudAPI
 * @classdesc Dropbox API abstaraction
 * @author Sergey Kobzev <jokernakartama@gmail.com>
 * @hideconstructor
 */
class Dropbox extends CloudAPI {
  static get settings () {
    return {
      winHeight: '600',
      winWidth: '800',
      clientId: DropboxConfig.id,
      stateName: DropboxConfig.name,
      redirectURI: DropboxConfig.redirectURI,
      thumbnailSize: 'w128h128',
      thumbnailFormat: 'jpeg',
      maxThumbnailBatchAmount: 25,
      trashBinIsUnsupported: true
    }
  }

  static get urls () {
    return {
      authorize: {
        path: 'https://www.dropbox.com/oauth2/authorize',
        params: {
          'response_type': 'token',
          'client_id': this.settings.clientId,
          'force_reapprove': 'true',
          'state': this.settings.stateName,
          'redirect_uri': this.settings.redirectURI
        }
      },
      token: 'https://api.dropboxapi.com/oauth2/token',
      revoke: 'https://api.dropboxapi.com/2/auth/token/revoke',
      resourceMeta: 'https://api.dropboxapi.com/2/files/get_metadata',
      filesList: 'https://api.dropboxapi.com/2/files/list_folder',
      sharedLinksList: 'https://api.dropboxapi.com/2/sharing/list_shared_links',
      download: 'https://api.dropboxapi.com/2/files/get_temporary_link',
      thumbnailBatch: 'https://content.dropboxapi.com/2/files/get_thumbnail_batch',
      thumbnail: 'https://content.dropboxapi.com/2/files/get_thumbnail',
      publish: 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
      unpublish: 'https://api.dropboxapi.com/2/sharing/revoke_shared_link',
      delete: 'https://api.dropboxapi.com/2/files/permanently_delete',
      remove: 'https://api.dropboxapi.com/2/files/delete_v2',
      makedir: 'https://api.dropboxapi.com/2/files/create_folder_v2',
      move: 'https://api.dropboxapi.com/2/files/move_v2',
      moveBatch: 'https://api.dropboxapi.com/2/files/move_batch',
      copy: 'https://api.dropboxapi.com/2/files/copy_v2',
      copyBatch: 'https://api.dropboxapi.com/2/files/copy_batch',
      restore: 'https://api.dropboxapi.com/2/files/restore'
    }
  }

  static get names () {
    return {
      'serviceName': 'dropbox',
      'pathQueryPrefix': '/',
      'limitUrlParamName': 'limit',
      'listKey': 'entries',
      'linksListKey': 'links',
      'listParentObject': null,
      'itemIdKey': 'id',
      'itemTypeKey': '.tag',
      'itemDirKey': 'folder',
      'itemPublicUrlKey': 'url', // from list_shared_links
      'itemPreviewKey': 'thumbnail', // from thumbnails list
      'itemFileKey': 'file',
      'itemNameKey': 'name',
      'itemModifiedKey': 'client_modified',
      'itemSizeKey': 'size',
      'rootPathIdentifier': ''
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
    return itemPath === ''
  }
  static isShared (rawData) {
    if (rawData);
    // just set the default value as it will be replaced later
    return null
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
    return item['path_display'].slice(1) // cut the started slash
  }
  static getPreview (rawData) {
    if (rawData);
    // just set the default value as it will be replaced later
    return null
  }

  /**
   * As query path of parsed resource has no slash at start,
   * this method makes right path for api query.
   * @param path {string} Parsed resource query path (generally with no slash at start)
   */
  static createPath (path) {
    if (path.slice(0, 1) === '/') {
      return path
    } else {
      return this.names.pathQueryPrefix + path
    }
  }

  /**
   * Obtains shared links. As Dropbox api does not provide any methods to get
   * the links of files of a particular directory, this method gets all of them
   * in one or multiple requests. This function is recursive and executes untill all
   * shared links is recieved.
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#sharing-list_shared_links}
   * @param callback {function} Callback function for a links list.
   * @param linkList {array} If the links list is incompleted new links merges in the list of previous request
   * @param cursor {string} A cursor key for incompleted requests
   */
  static getAllSharedLinks (callback, linkList = [], cursor = null) {
    var data = {
      'direct_only': true
    }
    if (cursor) data.cursor = cursor
    AX.post(this.urls.sharedLinksList)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': !200
      })
      .on('success', (body) => {
        var newList = linkList.concat(body[this.names.linksListKey])
        if (body['has_more'] && body['cursor']) {
          this.getAllSharedLinks(callback, newList, body['cursor'])
        } else {
          callback(newList)
        }
      })
      .send.json(data)
  }

  /**
   * Recieves thumbnails in multiple requests (because Dropbox limits amount
   * of thumbnails recieved from one request).
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#files-get_thumbnail_batch}
   * @param pathsArray {array} List of images paths
   * @returns {Promise} Promise.all from multiple requests (the data should be merged in one array after)
   */
  static getThumbnailBatch (pathsArray) {
    const max = this.settings.maxThumbnailBatchAmount
    const self  = this
    var slices = []
    for (let i = 0, start = 0, len = pathsArray.length; i < len; i++) {
      if (((i + 1) % max === 0 && i > 0) || (len < ((start + 1) * max) && i === len - 1)) {
        slices.push(pathsArray.slice((start * max), ((start + 1) * max)))
        start = start + 1
      }
    }
    const query = function (arraySlice) {
      return new Promise((resolve, reject) => {
        var entries = []
        for (let i = 0; i < arraySlice.length; i++) {
          entries.push({
            path: arraySlice[i],
            format: self.settings.thumbnailFormat,
            size: self.settings.thumbnailSize
          })
        }
        if (entries.length > 0) {
          AX.post(self.urls.thumbnailBatch)
            .headers({'Authorization': AUTH_TYPE + ' ' + self.accessToken})
            .status({
              'success': 200,
              'error': !200
            })
            .on('success', (body) => {
              resolve(body[self.names.listKey])
            })
            .on('error', (body, resp) => {
              reject(body, resp)
            })
            .send.json({
              entries
            })
        } else {
          resolve({entries: []})
        }
      })
    }
    return Promise.all(slices.map(query))
  }

  static createThumbnail (data) {
    return 'data:image/' + this.settings.thumbnailFormat + ';base64,' + data
  }

  /**
   * Merges thumbnails data recieved from Dropbox.getThumbnailBatch in serialized list of resources.
   * @param list {object} Resources list serialized by CloudAPI.serialize()
   * @param thumbs {array} Array of data recieved from getThumbnailBatch
   * @returns {object} Resources list with thumbnails data
   */
  static mergeThumbnailsWithList(list, thumbs) {
    var result = Object.assign({}, list)
    var thumbsList = [].concat(...thumbs)
    for (let i = 0, len = thumbsList.length; i < len; i++) {
      if (thumbsList[i][this.names.itemPreviewKey] && thumbsList[i].metadata && result[thumbsList[i].metadata.id]) {
        result[thumbsList[i].metadata.id].preview = this.createThumbnail(thumbsList[i][this.names.itemPreviewKey])
      }
    }
    return result
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

  /**
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#files-create_folder_v2}
   */
  static makeDir (parentPath, dirName, func = {}) {
    var destination = pathJoin(parentPath, dirName)
    AX.post(this.urls.makedir)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'exist': 409,
        'fail': ['!200', '!409'],
        'anyway': '!200'
      })
      .on('success', (body, resp) => {
        var metadata = body.metadata
        metadata[this.names.itemTypeKey] = this.names.itemDirKey
        var dirMeta = this.serialize(metadata)
        if (typeof func.success === 'function') func.success(dirMeta, resp)
      })
      .on('exist', (body, resp) => {
        if (typeof func.exist === 'function') func.exist(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send.json({
        path: this.createPath(destination),
        autorename: false
      })
    return false
  }

  /**
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#files-get_metadata}
   */
  static getResource (path, func = {}, params = {}) {
    if (path === '/' || path === '') {
      // getting metadata of root directory is unsupported so we use a preset
      if (typeof func.success === 'function') func.success(ROOT_DIR_DATA, ROOT_DIR_RESPONSE)
    } else {
      AX.post(this.urls.resourceMeta, params)
        .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
        .status({
          'success': 200,
          'error': 409,
          'fail': ['!409', '!200'],
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
        .send.json({
          path: this.createPath(path)
        })
    }
    return false
  }

  /**
   * @see Dropbox.getResource
   */
  static getResourceMeta (path, func = {}) {
    var success = func.success
    var callbacks = Object.assign({}, func, {
      success: (body, resp) => {
        var resourceMeta = this.serialize(body)
        if (typeof success === 'function') success(resourceMeta, resp)
      }
    })
    this.getResource(path, callbacks)
    return false
  }

  /**
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#files-list_folder}
   */
  static getResourceList (path, func = {}, trash = false) {
    if (!trash) {
      const getSharedLinksPromise = new Promise((resolve) => { this.getAllSharedLinks(resolve) })
      AX.post(this.urls.filesList)
        .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
        .status({
          'success': 200,
          'error': 409,
          'fail': ['!409', '!200'],
          'anyway': '!200'
        })
        .on('success', (body, resp) => {
          var list = this.serialize(body)
          /*
          var pathsArray = []
          for (let item in list) {
            if (list[item].type === 'picture') pathsArray.push(this.createPath(list[item].path))
          }
          this.getThumbnailBatch(pathsArray)
            .then((thumbsData) => {
              list = this.mergeThumbnailsWithList(list, thumbsData)
              return getSharedLinksPromise
            })
          */
          Promise.resolve()
            .then(() => {
              return getSharedLinksPromise
            })
            .then((recievedLinks) => {
              for (let i in recievedLinks) {
                if (recievedLinks[i][this.names.itemIdKey] in list && recievedLinks[i][this.names.itemPublicUrlKey]) {
                  list[recievedLinks[i][this.names.itemIdKey]].publicLink = recievedLinks[i][this.names.itemPublicUrlKey]
                }
              }
              if (typeof func.success === 'function') func.success(list, resp)
              if (typeof func.anyway === 'function') func.anyway(body, resp)
            })
            .catch((err) => {
              if (err); //pass
            })
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
        .send.json({
          path: path !== '' ? this.createPath(path) : ''
        })
    } else {
      if (typeof func.fail === 'function') func.fail('Not provided', null)
      if (typeof func.anyway === 'function') func.anyway('Not provided', null)
    }
    return false
  }

  /**
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#files-get_temporary_link}
   */
  static getDownloadLink (path, func = {}) {
    AX.post(this.urls.download)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 409,
        'fail': ['!409', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        var href = body.link
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
      .send.json({
        path: this.createPath(path)
      })
    return false
  }

  /**
   */
  static getPublicLink (path, func = {}) {
    AX.post(this.urls.sharedLinksList)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 409,
        'fail': ['!409', '!200'],
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
      .send.json({
        'path': this.createPath(path),
        'direct_only': true
      })
    return false
  }

  static publishResource (path, func = {}) {
    AX.post(this.urls.publish)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 409,
        'fail': ['!409', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        var publicLink = body[this.names.itemPublicUrlKey]
        if (typeof func.success === 'function') func.success(publicLink, resp)
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
      .send.json({
        path: this.createPath(path),
        settings: {
          'requested_visibility': {
              '.tag': 'public'
          }
        }
      })
    return false
  }

  /**
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#sharing-revoke_shared_link}
   */
  static unpublishResource (path, func = {}) {
    var anyway = func.anyway
    var publicUrl
    var callback = Object.assign({}, func, {
      success: (body) => {
        publicUrl = body[this.names.linksListKey][0][this.names.itemPublicUrlKey]
        AX.post(this.urls.unpublish)
          .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
          .status({
            'success': 200,
            'error': 409,
            'fail': ['!409', '!200'],
            'anyway': 'all'
          })
          .on('success', (body, resp) => {
            if (typeof func.success === 'function') func.success(publicUrl, resp)
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
          .send.json({
            url: publicUrl
          })
      },
      anyway: (body, resp) => {
        if (typeof anyway === 'function' && !publicUrl) anyway(body, resp)
      }
    })
    this.getPublicLink(path, callback)
    return false
  }

  /**
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#files-delete_v2}
   */
  static removeResource (path, func) {
    AX.post(this.urls.remove)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 409,
        'fail': ['!409', '!200'],
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
      .send.json({
        path: this.createPath(path)
      })
    return false
  }

  /**
   * Permanent deletion by api is not supported.
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#files-permanently_delete}
   */
  static deleteResource (path, func) {
    this.removeResource(path, func)
  }

  static copyOrMove (copy, currentPath, destination, func = {}) {
    // As the only urls are different, this method is common for both actions
    var url = copy ? this.urls.copy : this.urls.move
    var params = {
      'from_path': this.createPath(currentPath),
      'to_path': this.createPath(destination),
      'autorename': false
    }
    AX.post(url)
      .headers({'Authorization': AUTH_TYPE + ' ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'exist': 409,
        'fail': ['!200', '!409'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('exist', (body, resp) => {
        if (typeof func.error === 'function' && body['error_summary'] === 'from_lookup/not_found/') {
          // Dropbox does not return 404 code if the resource does not exists.
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
      .send.json(params)
    return false
  }

  /**
   * This method is like Dropbox.moveResourceTo
   */
  static renameResource (resourcePath, newname, func, overwrite = false) {
    var parent = dirname(resourcePath)
    var destination = pathJoin(parent, newname)
    var success = func.success
    var anyway = func.anyway
    var resourceMeta
    var dataCallback = Object.assign({}, func, {
      success: (body, resp) => {
        resourceMeta = this.serialize(body)
        // As Dropbox api is designed to make this method really heavy and slow, because
        // there is no possibility to obtain a public link and preview data from Dropbox.getResource()
        // and the recieved resource data appears to be merged with already existed,
        // it's a more rational way to just delete preview and public link (so them will not be changed in the app).
        // Initially, CloudAPI.renameResource() supposed to use only name in success callback,
        // but its behavior was changed, because of path-based (and therefore name-based) api's like Dropbox.
        // Because of that, an application needs only new name and new path from request if succeed,
        // but in theory, publicLink and preview data of the resource may be changed during this operation.
        delete resourceMeta.preview
        delete resourceMeta.publicLink
        if (typeof success === 'function') success(resourceMeta, resp)
      }
    })
    var actionCallback = Object.assign({}, func, {
      success: () => {
        this.getResource(destination, dataCallback)
      },
      anyway: (body, resp) => {
        if (typeof anyway === 'function' && !resourceMeta) anyway(body, resp)
      }
    })
    this.copyOrMove(false, resourcePath, destination, actionCallback, overwrite)
  }

  /**
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#files-copy_v2}
   */
  static copyResourceTo (path, destination, func = {}) {
    var resourceName = getNameFromPath(path)
    var newPath = pathJoin(destination, resourceName)
    this.copyOrMove(true, path, newPath, func)
  }

  /**
   * @see {@link https://www.dropbox.com/developers/documentation/http/documentation#files-move_v2}
   */
  static moveResourceTo (path, destination, func = {}) {
    var resourceName = getNameFromPath(path)
    var newPath = pathJoin(destination, resourceName)
    this.copyOrMove(false, path, newPath, func)
  }
}

export default Dropbox
