import uuidv4 from 'uuidv4'
import CloudAPI from './CloudAPI'

function resourceTemplate (dir = false) {
  const name = Math.random() * (1337 - 0)
  if (dir) {
    return {
      id: uuidv4(),
      name: '/dir_' + name,
      parent: 'parent',
      isRoot: false,
      type: 'dir',
      path: 'parent/dir_' + name,
      publicLink: null
    }
  } else {
    return {
      id: uuidv4(),
      name: 'file_' + name + '.ext',
      modified: '2016-04-29T19:35:21+00:00',
      type: 'script',
      size: 999,
      path: 'parent/file_' + name + '.ext',
      publicLink: null
    }
  }
}

export function fakeToken (service, expires_in, value = 'token') {
  return {
    'token': value,
    'error': null,
    'state': service,
    'expires_in': expires_in,
  }
} 

export function getFakeResource (dir = false, resource = {}) {
  return Object.assign({}, resourceTemplate(dir), resource)
}

export function getFakeList (addResource = false) {
  const dirsCount = Math.random() * (4 - 0)
  const filesCount = Math.random() * (4 - 0)
  const list = {}
  for (let i = 0; i < dirsCount; i++) {
    let res = getFakeResource(true)
    list[res.id] = res
  }
  for (let i = 0; i < filesCount; i++) {
    let res = getFakeResource()
    list[res.id] = res
  }
  if (addResource && addResource.id) {
    list[addResource.id] = addResource
  }
  return list
}

/**
 * @class
 * @extends CloudAPI
 * @classdesc Fake API abstaraction for tests
 * @author Sergey Kobzev <jokernakartama@gmail.com>
 * @hideconstructor
 */
class FakeCloudAPI extends CloudAPI {

  static get settings () {
    return {
      stateName: 'fake',
      tokenLifeTime: 3600
    }
  }

  static get urls () {
    return {
      authorize: {
        path: 'authorize',
        params: {
          'state': this.settings.stateName
        }
      }
    }
  }

  /**
   * Does nothing except error handling
   */
  static getToken (data, callback = () => {}, error = () => {}) {
    if (!data) {
      error(data)
    } else {
      callback(data)
    }
  }

  // API methods
  /**
   * 
   * @param {string} parentPath - Any path. Use callback name to call the callback
   * @param {string} dirName - The directory name. Uses on success.
   * @param {object} func - List of callbacks. Each one calls with its name as an argument, except success.
   * @param {function} func.success - Calls with fake directory as an argument
   */
  static makeDir (parentPath, dirName, func = {}) {
    if (parentPath === 'exsist' && typeof func.exist === 'function') func.exist('exist')
    if (parentPath === 'success' && typeof func.success === 'function') func.success(getFakeResource(true, { name: dirName, path: 'parent/' + dirName }))
    if (parentPath === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (parentPath === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }
  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {object} func - List of callbacks. Each one calls with its name as an argument, except success.
   * @param {function} func.success - Calls with fake resource as an argument
   */
  static getResourceMeta (path, func = {}) {
    if (path === 'success' && typeof func.success === 'function') func.success(getFakeResource(true))
    if (path === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (path === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }
  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {object} func - List of callbacks. Each one calls with its name as an argument, except success.
   * @param {function} func.success - Calls with fake list as an argument
   */
  static getResourceList (path, func = {}) {
    if (path === 'success' && typeof func.success === 'function') func.success(getFakeList())
    if (path === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (path === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }
  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {object} func - List of callbacks. Each one calls with its name as an argument.
   */
  static getDownloadLink (path, func = {}) {
    if (path === 'success' && typeof func.success === 'function') func.success('success')
    if (path === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (path === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }
  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {object} func - List of callbacks. Each one calls with its name as an argument.
   */
  static getPublicLink (path, func = {}) {
    if (path === 'success' && typeof func.success === 'function') func.success('success')
    if (path === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (path === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }

  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {object} func - List of callbacks. Each one calls with its name as an argument.
   */
  static publishResource (path, func = {}) {
    if (path === 'success' && typeof func.success === 'function') func.success('success')
    if (path === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (path === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }

  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {object} func - List of callbacks. Each one calls with its name as an argument.
   */
  static unpublishResource (path, func) {
    if (path === 'success' && typeof func.success === 'function') func.success('success')
    if (path === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (path === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }

  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {object} func - List of callbacks. Each one calls with its name as an argument.
   */
  static removeResource (path, func) {
    if (path === 'success' && typeof func.success === 'function') func.success('success')
    if (path === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (path === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }

  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {object} func - List of callbacks. Each one calls with its name as an argument.
   */
  static deleteResource (path, func) {
    this.removeResource(path, func)
  }

  /**
   * 
   * @param {string} resourcePath - Any path. Use callback name to call the callback
   * @param {string} newname - A new name. Uses on success.
   * @param {object} func - List of callbacks. Each one calls with its name as an argument, except success.
   * @param {function} func.success - Calls with new name as an argument
   */
  static renameResource (resourcePath, newname, func) {
    if (resourcePath === 'success' && typeof func.success === 'function') func.success(newname)
    if (resourcePath === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (resourcePath === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }

  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {string} destination - A new directory for the resource. Uses on success.
   * @param {object} func - List of callbacks. Each one calls with its name as an argument, except success.
   * @param {function} func.success - Calls with destination as an argument
   */
  static copyResourceTo (path, destination, func = {}) {
    if (path === 'success' && typeof func.success === 'function') func.success(destination)
    if (path === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (path === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }

  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {string} destination - A new directory for the resource. Uses on success.
   * @param {object} func - List of callbacks. Each one calls with its name as an argument, except success.
   * @param {function} func.success - Calls with destination as an argument
   */
  static moveResourceTo (path, destination, func = {}) {
    this.copyResourceTo (path, destination, func)
  }

  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {object} func - List of callbacks. Each one calls with its name as an argument.
   */
  static restoreResource (path, func = {}) {
    if (path === 'exsist' && typeof func.exist === 'function') func.exist('exist')
    if (path === 'success' && typeof func.success === 'function') func.success('success')
    if (path === 'fail' && typeof func.fail === 'function') func.fail('fail')
    if (path === 'error' && typeof func.error === 'function') func.error('error')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }

  /**
   * 
   * @param {string} path - Any path. Use callback name to call the callback
   * @param {object} func - List of callbacks. Each one calls with its name as an argument.
   */
  static purgeTrash (func = {}) {
    if (typeof func.success === 'function') func.success('success')
    if (typeof func.anyway === 'function') func.anyway('anyway')
  }
}

export default FakeCloudAPI
