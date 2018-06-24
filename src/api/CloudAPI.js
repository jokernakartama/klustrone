/* eslint no-unused-vars: [0, { "args": "none" }] */
import { urlStr } from '~/utils/ajax'
import getFileType from './getFileType'

/**
 * Other applications can send messages, while the window is waiting for a
 * message with token data. The problem manifests itself in the unexpected
 * closing of the authorization window and recieving incorrect data.
 */
const MESSAGE_SOURCE_IDENTIFIER = 'cloud-api-postcode-method'

/**
 * Common abstract interface for services api
 * @abstract
 * @class
 * @classdesc Most of the methods provided by the class use parameter func: an object
 * that may contain the following callback functions:
 * - success - In most cases this function is used to handle the result of
 * a query (sometimes after some preparations).
 * - error - This function should handle any api errors like absence of resource
 * or access errors.
 * - exist - In some cases, service can throw errors of resource existance,
 * so those errors should be handled there.
 * - fail - This function should handle server errors, unknown errors or cases
 * when some functions limited by service api.
 * For example, Dropbox does not provide special methods to get and manage
 * trashed files. As the function is used in different cases,
 * it can be called not in an asynchronous query, so do not forget to call
 * func.anyway if it's nessesary.
 * - anyway - This function mostly notices that an asynchronous query (sometimes
 *  without a query itself) completed (successfully or not), in methods which use
 * consecutive queries it should be called in last one.
 * @author Sergey Kobzev <jokernakartama@gmail.com>
 * @hideconstructor
 */
class CloudAPI {
  /**
   * Any settings for API
   * @property {string} winHeight - Authorization window height, used in openAuthWindow()
   * @property {string} winWidth - Authorization window width, used in openAuthWindow()
   * @property {string} stateName - Service name as identifier (to use it in url or as a class name)
   * @property {number} tokenLifeTime - Token lifetime provided by service in seconds.
   * Set it if it's short enough (for example, less than a day). Defined lifetime can be
   * used to show time to token expiration in percents rather than in seconds.
   * @property {*} anyParameter - Any parameter which is used in code
   */
  static get settings () {
    return {
      winHeight: '600',
      winWidth: '800',
    }
  }

  /**
   * Urls for requests.
   * @abstract
   * @property {object} authorize - Used in openAuthWindow()
   * @property {string} authorize.path - Authorization url
   * @property {object} authorize.params - Authorization url GET parameters
   * @property {(string|object)} anyUrlName - Any property to use in queries
   * @example
   * // somewhere in our api we use this.urls.token
   * return {
   *   authorize: {
   *     // we use serializer to set url as https://anycloud.com/auth?query_parameter=value&state=cloudservice
   *     path: 'https://anycloud.com/auth',
   *     params: {
   *       query_parameter: 'value',
   *       state: 'cloudservice'
   *     }
   *   },
   *  // no query parameters, so the string is more convenient
   *  token: 'https://anycloud.com/token'
   * }
   */
  static get urls () {
  }

  /**
   * Set api response object identifiers
   * for internal usage
   * @abstract
   * @property {string} serviceName - Used in openAuthWindow
   * @property {string} limitUrlParamName - Limit parameter key
   * @property {string} listKey - Key to get a resources list
   * @property {string} listParentObject - May be useful if raw response contains
   * a resource list in third level of nesting
   * @property {string} itemIdKey - Key to get the resource id
   * @property {string} itemTypeKey - Key to get the resource type
   * @property {string} itemDirKey - Value to consider the resource as directory
   * @property {string} itemFileKey - Value to consider resource as file
   * @property {string} itemNameKey - Key to get resource name
   * @property {string} itemModifiedKey - Key to get resource date
   * @property {string} itemPreviewKey - Key to get resource preview
   * @property {string} itemSizeKey - Key to get resource size
   * @example
   * return {
   *  'serviceName': 'disk',
   *  'limitUrlParamName': 'limit',
   *  'listKey': 'items',
   *  'listParentObject': '_embedded',
   *  'itemIdKey': 'resource_id',
   *  'itemTypeKey': 'type',
   *  'itemDirKey': 'dir',
   *  'itemFileKey': 'file',
   *  'itemNameKey': 'name',
   *  'itemModifiedKey': 'modified',
   *  'itemPreviewKey': 'preview',
   *  'itemSizeKey': 'size'
   * }
   * @returns {object}
   */
  static get names () {
    return {}
  }

  /**
   * It describes whether the resource is a directory or not.
   * For Dropbox it should return i.['.tag'] === 'folder'.
   * @abstract
   * @param {string} identifier - Resource identifier (path or id)
   * @returns {boolean}
   */
  static isDir (item) {
  }

  /**
   * It describes whether the resource is a file or not.
   * @abstract
   * @param {string} identifier - Resource identifier (path or id)
   */
  static isFile (item) {
  }

  /**
   * It describes whether the data contains a resource list or not.
   * @abstract
   * @param {object} rawResponse - JSON parsed response body
   */
  static isList (rawResponse) {
  }

  /**
   * @abstract
   * @param {object} rawData
   * @returns {boolean}
   */
  static isRoot (rawData) {
  }

  /**
   * @abstract
   * @param {object} rawData
   * @returns {(string|null)} - Shared link or null
   */
  static isShared (rawData) {
  }

  /**
   * Returns item path that is used for requests
   * @abstract
   * @example
   * // For Yandex Disk just cuts the "disk:/" prefix
   * // Though this prefix can be omitted in queries and
   * // useless if we use the path in any service-independent format
   * // e. g. in address bar for quick access
   * return item['path'].slice(5)
   * @example
   * // For Dropbox just choose the right property
   * return item['path_display']
   * @example
   * // For Google Drive we use the resource id
   * // to make a request
   * return item['id']
   * @param identifier {string} Resource identifier (path or id)
   * @returns {string}
   */
  static getItemPath (item) {
  }

  /**
   * Obtains parent id or path from resource metadata.
   * @abstract
   * @see parseDir
   * @param {object} rawData
   * @returns {(string|null)} - returns null if resource is root
   */
  static getParent (rawData) {
  }

  /**
   * Obtains a preview picture if supported.
   * @abstact
   * @param {object} rawData
   * @returns {(string|null)} - a preview link or null
   */
  static getPreview (rawData) {
    return rawData[this.names.itemPreviewKey]
  }

  /**
   * Serializes directory data.
   * @see getItemPath
   * @param {object} rawData
   * @returns {object}
   */
  static parseDir (rawData) {
    var resource = {}
    resource.id = rawData[this.names.itemIdKey]
    resource.name = rawData[this.names.itemNameKey]
    resource.parent = this.getParent(rawData)
    resource.isRoot = this.isRoot(rawData)
    resource.type = 'dir'
    resource.path = this.getItemPath(rawData)
    resource.publicLink = this.isShared(rawData)
    if (resource.isRoot) resource.name = this.settings.stateName + ':'
    return resource
  }

  /**
   * Serializes file data.
   * @param {object} rawData
   * @returns {object}
   */
  static parseFile (rawData) {
    var resource = {}
    resource.id = rawData[this.names.itemIdKey]
    resource.name = rawData[this.names.itemNameKey]
    resource.modified = rawData[this.names.itemModifiedKey]
    resource.type = getFileType(rawData[this.names.itemNameKey])
    resource.size = +rawData[this.names.itemSizeKey]
    resource.path = this.getItemPath(rawData)
    resource.preview = this.getPreview(rawData)
    resource.publicLink = this.isShared(rawData)
    return resource
  }

  /**
   * Serializes raw response data to directory object or file object.
   * @param {object} rawData
   * @returns {object}
   */
  static serialize (rawData) {
    var serialized
    if (this.isList(rawData)) {
      serialized = {}
      rawData[this.names.listKey].forEach((item) => {
        if (this.isDir(item)) {
          serialized[item[this.names.itemIdKey]] = this.parseDir(item)
        } else if (this.isFile(item)) {
          serialized[item[this.names.itemIdKey]] = this.parseFile(item)
        }
      })
    } else {
      if (this.isDir(rawData)) {
        serialized = this.parseDir(rawData)
      } else if (this.isFile(rawData)) {
        serialized = this.parseFile(rawData)
      }
    }
    return serialized
  }

  // API methods

  /**
   * Sends a request to make a directory
   * @abstract
   * @param {string} parentIdentifier - Parent resource id or path
   * @param {string} dirName - Name of the directory
   * @param {object} func - Object of callbacks: success, error, exist, fail, anyway
   * @param {function} func.success - Takes a serialized resource meta as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.exist - Takes the response body as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static makeDir (parentIdentifier, dirName, func = {}) {
  }

  /**
   * Obtains raw metadata of the resource.
   * @abstract
   * @param {string} identifier - Path or id, depending on the service
   * @param {object} func - Object of callbacks: success, error, fail, anyway
   * @param {function} func.success - Takes a raw resource meta as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   * @param {object} params - Any parameters (e.g. fields for request)
   */
  static getResource (identifier, func = {}, params = {}) {
  }

  /**
   * Obtains metadata of the resource.
   * @abstract
   * @param {string} identifier - Path or id, depending on the service
   * @param {object} func - Object of callbacks: success, error, fail, anyway
   * @param {function} func.success - Takes a serialized resource meta as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static getResourceMeta (identifier, func = {}) {
  }

  /**
   * Obtains the resource children list
   * In most cases, it is called by getResource(), if the second one has succeed
   * (if it uses request).
   * @abstract
   * @see parseList()
   * @param {string} identifier -  Path or id, depending on the service
   * @param {object} func - Object of callbacks: success, error, fail, anyway
   * @param {function} func.success - Takes a serialized resources list as the first argument.
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   * @param {boolean} trash - Whether only trashed files should be included
   */
  static getResourceList (identifier, func = {}, trash = false) {
  }

  /**
   * Obtains a download link
   * @abstract
   * @param {string} identifier - Resource identifier (path or id)
   * @param {object} func - Object of callbacks: success, error, fail, anyway
   * @param {function} func.success - Takes a download link as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static getDownloadLink (identifier, func = {}) {
  }

  /**
   * In common, it publishes a resource, and calls function with the resource
   * public link as argument.
   * @abstract
   * @param {string} identifier - Resource identifier (path or id)
   * @param {object} func - Object of callbacks: success, error, fail, anyway
   * @param {function} func.success - Takes a public link as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static publishResource (identifier, func = {}) {
  }

  /**
   * Unpublishes the resource.
   * @abstract
   * @param {string} identifier - Resource identifier (path or id)
   * @param {object} func - Object of callbacks: success, error, fail, anyway
   * @param {function} func.success - Takes the response body as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static unpublishResource (identifier, func = {}) {
  }

  /**
   * Obtains public link. This method may send request or calculate link. Used
   * in other methods.
   * @abstract
   * @param {string} identifier - Resource identifier (path or id)
   * @param {object} func - Object of callbacks: success, error, fail, anyway
   * @param {function} func.success - Takes any data as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static getPublicLink (identifier, func = {}) {
  }

  /**
   * Removes the resource
   * @abstract
   * @param {string} identifier - Resource identifier (path or id)
   * @param {object} func - Object of callbacks: success, error, fail, anyway
   * @param {function} func.success - Takes the response body as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   * @param {object} params - Any query parameters
   */
  static removeResource (identifier, func = {}, params = {}) {
  }

  /**
   * Deletes the resource permanently
   * @abstract
   * @see removeResource()
   * @param {string} identifier - Resource identifier (path or id)
   * @param {object} func - Object of callbacks: success, error, fail, anyway
   * @param {function} func.success - Takes the response body as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static deleteResource (identifier, func = {}) {
  }

  /**
   * In most cases moves file to the same directory with new name or makes a
   * patch request, if service supports this.
   * @abstract
   * @see moveResourceTo()
   * @param {string} identifier - Resource identifier (path or id)
   * @param {string} newname - New file name
   * @param {object} func - Object of callbacks: success, error, exist, fail, anyway
   * @param {function} func.success - Takes the resource serialized meta as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.exist - Takes the response body as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static renameResource (identifier, newname, func = {}) {
  }

  /**
   * Sends copy request. The new file should be unshared.
   * @abstract
   * @param {string} identifier - Resource identifier (path or id)
   * @param {string} destination - Path or id of parent directory
   * @param {object} func - Object of callbacks: success, error, exist, fail, anyway
   * @param {function} func.success - Takes the response body as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.exist - Takes the response body as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static copyResourceTo (identifier, destination, func = {}) {
  }

  /**
   * Sends move request.
   * @abstract
   * @param {string} identifier - Resource identifier (path or id)
   * @param {string} destination - Path or id of parent directory
   * @param {object} func - Object of callbacks: success, error, exist, fail, anyway
   * @param {function} func.success - Takes the response body as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.exist - Takes the response body as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static moveResourceTo (identifier, destination, func = {}) {
  }

  /**
   * Restores file from trash.
   * @abstract
   * @param {object} item - Parsed resource object
   * @param {boolean} overwrite
   * @param {object} func - Object of callbacks: success, error, exist, fail, anyway
   * @param {function} func.success - Takes the response body as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.exist - Takes the response body as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static restoreResource (identifier, func = {}, overwrite = false) {
  }

  /**
   * Purges trash bin.
   * @param {object} func - Object of callbacks: success, error, exist, fail, anyway
   * @param {function} func.success - Takes the response body as the first argument
   * @param {function} func.error - Takes the response body as the first argument
   * @param {function} func.fail - Takes the response body (or null if it's not provided)
   * as the first argument
   * @param {function} func.anyway - Takes the response body as the first argument
   */
  static purgeTrash (func = {}) {
  }

  /**
   * This method may not be overwritten, because of similarity of APIs.
   * It should post object which contains a code and/or an error in window.opener
   */
  static postCode () {
    var token = /access_token=([^&]+)/.exec(window.document.location.hash)
    var expires_in = /expires_in=([^&]+)/.exec(window.document.location.hash)
    var state = /state=([^&]+)/.exec(window.document.location.hash)
    var error = /error=([^&]+)/.exec(window.document.location.hash)
    if (token === null && error === null) {
      return false
    } else {
      var resp = {
        token: token,
        error: error,
        state: state,
        expires_in: expires_in
      }
      for (let key in resp) {
        if (resp[key] !== null) {
          resp[key] = resp[key][1]
        }
      }
      if (window.opener !== null) {
        // the origin should  be explicitly specified instead of "*"
        window.opener.postMessage({ source: MESSAGE_SOURCE_IDENTIFIER, payload: resp }, '*')
      }
      return true
    }
  }

  /**
   * Opens an authorization window and call the callback function when recieves message.
   * @param {function} callback - Function that takes data and popup window as arguments
   */
  static openAuthWindow (callback) {
    var params = urlStr(this.urls.authorize.params)
    var win = window.open(this.urls.authorize.path + '?' + params, 'serviceAuthorizationWindow', 'width=' + this.settings.winWidth + ',height=' + this.settings.winHeight)
    var onMessage = function onMessage (e) {
      if (e.data.source === MESSAGE_SOURCE_IDENTIFIER) {
        window.removeEventListener('message', onMessage)
        if (typeof callback === 'function') callback(e.data.payload, win)
      }
    }
    window.addEventListener('message', onMessage)
  }

  /**
   * This method recieves token data from anywhere
   * (e. g. it can be recieved from any storage or by parsing redirect url)
   * and calls the callback on it. Should be overwritten, as can require any preparations,
   * like token checking or data formatting.
   * @abstract
   * @param {object} data - Any parsed data from url.
   * @param {function} callback
   * @param {function} error
   */
  static getToken (data, callback = () => {}, error = () => {}) {
  }

  /**
   * Sets tokens. Appears to be immidiately recieved data from getToken().
   * Because of common format for response data, in most cases should not be overwritten.
   * Used to not change token properties directly.
   * @param {object} data - Token data
   * @param {function} callback
   */
  static saveTokenData (data, callback = () => {}) {
    this.accessToken = data['token']
    this.uuu = 'hey'
    callback(data)
  }

  /**
   * Revokes authorization.
   * Mostly just clears session through callback, if service does not provide
   * any revoke interface.
   * @param {function} callback
  */
  static revokeAuthorization (callback = () => {}) {
    delete this.accessToken
    callback()
  }
}

export default CloudAPI
