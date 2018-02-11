/* eslint no-unused-vars: [0, { "args": "none" }] */
import { urlStr } from '~/utilities/ajax'
import getFileType from './getFileType'

/**
 * Other applications can send messages, while the window is waiting for a message with token data.
 * The problem manifests itself in the unexpected closing of the authorization window and recieving
 * incorrect data.
 */
const MESSAGE_SOURCE_IDENTIFIER = 'cloud-api-postcode-method'

/**
 * Common abstract interface for services api
 * @abstract
 * @class
 * @classdesc Most of the methods provided by the class use parameter func: an object that
 * may contain the following callback functions:
 * - success - In most cases this function is used to handle the result of a query (sometimes after some preparations).
 * - error - This function should handle any api errors like absence of resource or access errors.
 * - exist - In some cases, service can throw errors of resource existance, so those errors should be handled there.
 * - fail - This function should handle server errors, unknown errors or cases when some functions limited by service api.
 * For example, Dropbox does not provide special methods to get and manage trashed files. As the function is used in different cases,
 * it can be called not in an asynchronous query, so do not forget to call func.anyway if it's nessesary.
 * - anyway - This function mostly notices that an asynchronous query (sometimes without a query itself) completed (successfully or not),
 * in methods which use consecutive queries it should be called in last one.
 * @author Sergey Kobzev <jokernakartama@gmail.com>
 * @hideconstructor
 */
class CloudAPI {
  /**
   * Any settings for API
   * @property winHeight {string} authorization window height, used in openAuthWindow()
   * @property winWidth {string} authorization window width, used in openAuthWindow()
   * @property noRefreshBorder {number} the minimum time from which the token is considered as infinite (to set refresh or revoke timeouts)
   * @property anyParameter {*} any parameter which are used in code
   */
  static get settings () {
    return {
      winHeight: '600',
      winWidth: '800',
      noRefreshBorder:  86400 // a day should be enough
    }
  }

  /**
   * Urls for requests.
   * @abstract
   * @property authorize {object} used in openAuthWindow()
   * @property anyUrlName {(string|object)} any property to use in queries
   * @example
   * // somewhere in our api we use this.urls.token
   * return {
   *   authorize: {
   *     path: 'https://anycloud.com/auth', // we use serializer to set url as https://anycloud.com/auth?query_parameter=value&state=cloudservice
   *     params: {
   *       query_parameter: 'value',
   *       state: 'cloudservice'
   *     }
   *   },
   *  token: 'https://anycloud.com/token' // no query parameters, so the string is more convenient
   * }
   */
  static get urls () {
  }

  /**
   * Set api response object identifiers
   * for internal usage
   * @abstract
   * @property serviceName {string} used in openAuthWindow
   * @property limitUrlParamName {string} limit parameter key
   * @property listKey {string} key to get a resources list
   * @property listParentObject {string} may be useful if raw response contains a resource list in third level of nesting
   * @property itemIdKey {string} key to get resource id
   * @property itemTypeKey {string} key to get resource type
   * @property itemDirKey {string} value to consider resource as directory
   * @property itemFileKey {string} value to consider resource as file
   * @property itemNameKey {string} key to get resource name
   * @property itemModifiedKey {string} key to get resource date
   * @property itemPreviewKey {string} key to get resource preview
   * @property itemSizeKey {string} key to get resource size
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
  }

  /**
   * It describes whether the resource is a directory or not.
   * For Dropbox it should return i.['.tag'] === 'folder'.
   * @abstract
   * @param identifier {string} Resource identifier (path or id)
   * @returns {boolean}
   */
  static isDir (item) {
  }

  /**
   * It describes whether the resource is a file or not.
   * @abstract
   * @param identifier {string} Resource identifier (path or id)
   */
  static isFile (item) {
  }

  /**
   * It describes whether the data contains a resource list or not.
   * @abstract
   * @param rawResponse {object} JSON parsed response body
   */
  static isList (rawResponse) {
  }

  /**
   * @abstract
   * @param rawData {object}
   * @returns {boolean}
   */
  static isRoot (rawData) {
  }
  
  /**
   * @abstract
   * @param rawData {object}
   * @returns {(string|null)} Shared link or null
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
   * @param rawData {object}
   * @returns {(string|null)} Returns null if resource is root
   */ 
  static getParent (rawData) {
  }

  /**
   * Obtains a preview picture if supported.
   * @abstact
   * @param rawData {object}
   * @returns {(string|null)} Returns the preview link or null
   */
  static getPreview (rawData) {
    return rawData[this.names.itemPreviewKey]
  }

  /**
   * Serializes directory data.
   * @see getItemPath
   * @param rawData {object}
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
    return resource
  }

  /**
   * Serializes file data.
   * @param rawData {object}
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
   * @param rawData {object}
   * @returns {object}
   */
  static serialize (rawData) {
    var serialized
    if (this.isList(rawData)) {
      serialized = {
        resources: {}
      }
      rawData[this.names.listKey].forEach((item) => {
        if (this.isDir(item)) {
          serialized.resources[item[this.names.itemIdKey]] = this.parseDir(item)
        } else if (this.isFile(item)) {
          serialized.resources[item[this.names.itemIdKey]] = this.parseFile(item)
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
   * Calls a callback with the response as argument (mostly do not use arguments)
   * [ON SUCCESS]: This method should call the success callback with an object of the serialized RESOURCE META as the first argument.
   * @abstract
   * @param parentIdentifier {string} Parent resource id or path 
   * @param dirName Name of the directory
   * @param func {object} Object of callbacks: success, error, exist, fail, anyway
   */
  static makeDir (parentIdentifier, dirName, func = {}) {
  }

  /**
   * Obtains metadata of the resource.
   * [ON SUCCESS]: This method should call the success callback with an object of the RESPONSE BODY as the first argument.
   * @abstract
   * @param identifier {string} Path or id, depending on the service
   * @param func {object} Object of callbacks: success, error, fail, anyway
   * @param params {object} Any parameters (e.g. fields for request)
   */
  static getResourceMeta (identifier, func = {}, params = {}) {
  }

  /**
   * Get resource parameters by identifier. Generally, it is used for directory listing.
   * In most cases, it should get information whether the directory is root or not and get its parent identifier (path or id),
   * so the data can be calculated (if path is used) or recieved by request (if id is used, e. g. for Google Drive).
   * [ON SUCCESS]: This method should call the success callback with an object of the RESOURCE DATA (includes list of children in the "resources"
   * key and own meta in the "current" key) as the first argument.
   * @abstract
   * @see getFilesList
   * @param identifier {string} Resource identifier (path or id)
   * @param func {object} Object of callbacks: success, error, fail, anyway
   * @param trash {boolean} Whether only trashed files should be included
   */ 
  static getResource (identifier, func = {}, trash = false) {
  }

  /**
   * Appears to call function with parsed list for success and response for others as argument (mostly do not use arguments).
   * In most cases, it is called by getResource(), if the second one has succeed (if it uses request). 
   * [ON SUCCESS]: This method should call the success callback with an object of the RESOURCES LIST as the first argument.
   * It CAN include the resource own data in the "current" key.
   * @abstract
   * @see getResource()
   * @see parseList()
   * @param identifier {string} Unlike others this method uses unspecified type of parameter, because services
   * use different concepts of their hierarchy, so, for Dropbox, the folder path is enough, for Google Drive it should be used parent id.
   * @param func {object} Object of callbacks: success, error, fail, anyway
   * @param trash {boolean} Whether only trashed files should be included
   */
  static getFilesList (identifier, func = {}, trash = false) {
  }

  /**
   * Calls a callback with the link as argument for success 
   * and response for others as argument (mostly do not use arguments)
   * [ON SUCCESS]: This method should call the success callback with a string of the RESOURCE DOWNLOAD LINK as the first argument.
   * @abstract
   * @param identifier {string} Resource identifier (path or id)
   * @param func {object} Object of callbacks: success, error, fail, anyway
   */
  static getDownloadLink (identifier, func = {}) {
  }

  /**
   * In common, it publishes a resource, and calls function with the resource public link as argument.
   * [ON SUCCESS]: This method should call the success callback with an object of the RESPONSE BODY as the first argument.
   * @abstract
   * @param identifier {string} Resource identifier (path or id)
   * @param func {object} Object of callbacks: success, error, fail, anyway
   */
  static publishResource (identifier, func = {}) {
  }

  /**
   * Unpublishes resource.
   * [ON SUCCESS]: This method should call the success callback with an object of the RESPONSE BODY as the first argument.
   * @abstract
   * @param identifier {string} Resource identifier (path or id)
   * @param func {object} Object of callbacks: success, error, fail, anyway
   */
  static unpublishResource (identifier, func = {}) {
  }

  /**
   * Obtains public link. This method may send request or calculate link. Used in other methods.
   * [ON SUCCESS]: This method can provide ANY DATA as the first argument as the data appears to be parsed in other methods.
   * @abstract
   * @param identifier {string} Resource identifier (path or id)
   * @param func {object} Object of callbacks: success, error, fail, anyway
   */
  static getPublicLink () {
  }

  /**
   * Calls a callback with the response as argument (mostly do not use arguments).
   * [ON SUCCESS]: This method should call the success callback with an object of the RESPONSE BODY as the first argument.
   * @abstract
   * @param identifier {string} Resource identifier (path or id)
   * @param func {object} Object of callbacks: success, error, fail, anyway
   * @param params {object} Any query parameters
   */
  static removeResource (identifier, func = {}, params = {}) {
  }

  /**
   * In most cases, calls removeResource() with parameters
   * [ON SUCCESS]: This method should call the success callback with an object of the RESPONSE BODY as the first argument.
   * @abstract
   * @see removeResource()
   * @param identifier {string} Resource identifier (path or id)
   * @param func {object} Object of callbacks: success, error, fail, anyway
   */
  static deleteResource (identifier, func = {}) {
  }

  /**
   * In most cases moves file to the same directory with new name or makes a patch request, if service supports this.
   * [ON SUCCESS]: This method should call the success callback with an object of the serialized RESOURCE META as the first argument.
   * @abstract
   * @see moveResourceTo()
   * @param identifier {string} Resource identifier (path or id)
   * @param newname {string} New file name
   * @param func {object} Object of callbacks: success, error, exist, fail, anyway
   */
  static renameResource (identifier, newname, func = {}) {
  }

  /**
   * Sends copy request. New file should be unshared.
   * [ON SUCCESS]: This method should call the success callback with an object of the RESPONSE BODY as the first argument.
   * [ON EXIST]: If this method can call "exist" function it should call the exist callback with the path of the resource that will replace existed.
   * Make sence in path-based service api's.
   * @abstract
   * @param identifier {string} Resource identifier (path or id)
   * @param destination {string} Path or id of parent directory
   * @param func {object} Object of callbacks: success, error, exist, fail, anyway
   */
  static copyResourceTo (identifier, destination, func = {}) {
  }

  /**
   * Sends move request.
   * [ON SUCCESS]: This method should call the success callback with an object of the RESPONSE BODY as the first argument.
   * [ON EXIST]: If this method can call "exist" function it should call the exist callback with the path of the resource that will replace existed.
   * Make sence in path-based service api's.
   * @abstract
   * @param identifier {string} Resource identifier (path or id)
   * @param destination {string} Path or id of parent directory
   * @param func {object} Object of callbacks: success, error, exist, fail, anyway
   */
  static moveResourceTo (identifier, destination, func = {}) {
  }

  /**
   * Restores file from trash and calls function with resource as argument if succeed.
   * [ON SUCCESS]: This method should call the success callback with an object of the RESPONSE BODY as the first argument.
   * @abstract
   * @param item {object} Parsed resource object
   * @param overwrite {boolean}
   * @param func {object} Object of callbacks: success, error, exist, fail, anyway
   */
  static restoreResource (identifier, func = {}, overwrite = false) {
  }
  
  /**
   * Purges trash bin.
   */
  static purgeTrash () {
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
   * @param callback {function} Function that recieve data and popup window as arguments
   */
  static openAuthWindow (callback) {
    var params = urlStr(this.urls.authorize.params)
    var win = window.open(this.urls.authorize.path + '?' + params, 'auth' + this.names.serviceName, 'width=' + this.settings.winWidth + ',height=' + this.settings.winHeight)
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
   * @param data {object} Any parsed data from url.
   * @param callback {function}
   * @param error {function}
   */
  static getToken (data, callback = () => {}, error = () => {}) {
  }

  /**
   * Sets tokens. Appears to be immidiately recieved data from getToken().
   * Because of common format for response data, in most cases should not be overwritten.
   * Used to not change token properties directly.
   * @param data {object} Token data
   * @param callback {function}
   */
  static saveTokenData (data, callback = () => {}) {
    this.accessToken = data['token']
    callback()
  }

  /**
   * Revokes authorization.
   * Mostly just clear session through callback, if service does not provide any revoke interface.
   * @param callback {function}
  */
  static revokeAuthorization (callback = () => {}) {
    delete this.accessToken
    callback()
  }
}

export default CloudAPI
