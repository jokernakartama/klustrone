import xhr from 'xhr'

/**
 * Serializes objects to urlencoded query string
 * @param {object} data
 * @returns {string}
 */
export function urlStr (data) {
  var str = ''
  for (var key in data) {
    str = str + '&' + key + '=' + encodeURIComponent(data[key].toString())
  }
  return str.slice(1)
}

var AX = function () {
  this.url = ''
  this.method = ''
  this._headersMap = {}
  this._statusesMap = {}
  this._callbacksMap = {}
}

var create = function (o) {
  if (!(o instanceof AX)) {
    return new AX()
  } else {
    return o
  }
}

/**
 * Calls function according on response status
 * @param {AX} instance - AX instance
 */
function callback (instance) {
  return (Error, resp, body) => {
    for (let statusEvent in instance._callbacksMap) {
      let rule = false
      if (statusEvent in instance._statusesMap) {
        if (instance._statusesMap[statusEvent] instanceof Array) {
          // status arrays
          let excludes = []
          let includes = []
          for (let n = 0; n < instance._statusesMap[statusEvent].length; n++) {
            if (typeof instance._statusesMap[statusEvent][n] === 'number') {
              includes.push(instance._statusesMap[statusEvent][n])
            } else if (typeof instance._statusesMap[statusEvent][n] === 'string' && instance._statusesMap[statusEvent].slice(0, 1) === '!') {
              excludes.push(Number(instance._statusesMap[statusEvent][n].slice(1)))
            }
          }
          if (includes.indexOf(resp.statusCode) > -1 && excludes.indexOf(resp.statusCode) === -1) rule = true
        } else if (typeof instance._statusesMap[statusEvent] === 'number' && instance._statusesMap[statusEvent] === resp.statusCode) {
          // status number
          rule = true
        } else if (typeof instance._statusesMap[statusEvent] === 'string') {
          // status string
          if (instance._statusesMap[statusEvent].toLowerCase() === 'all') {
            // for all statuses
            rule = true
          } else if (instance._statusesMap[statusEvent].slice(0, 1) === '!' && +instance._statusesMap[statusEvent].slice(1) !== resp.statusCode) {
            rule = true
          }
        }
        if (rule) {
          if (resp.headers['content-type'] && resp.headers['content-type'].indexOf('application/json') > -1) {
            try {
              body = JSON.parse(body)
            } catch (e) {
              if (e); // pass
            }
          }
          instance._callbacksMap[statusEvent](body, resp)
        }
      }
    }
    // clear object after request
    instance.url = ''
    instance.method = ''
    instance._headersMap = {}
    instance._statusesMap = {}
    instance._callbacksMap = {}
  }
}

/**
 * Sends request with params
 * @param {AX} instance - AX instance
 * @param {(string|FormData)} data
 */
function request (instance, data) {
  /**
   * Sends request with params
   */
  instance = create(instance)
  if (!instance.url) throw Error('Specify the url before sending')
  xhr(
    instance.url,
    {
      method: instance.method,
      body: data,
      headers: instance._headersMap
    },
    callback(instance)
  )
}

/**
 * Sets instance query parameters
 * @param {AX} instance - AX instance
 * @param {string} url - URL without any query parameters
 * @param {string} method
 * @param {string} params - Query parameters
 */
function setUrlAndMethod (instance, url, method, params) {
  instance = create(instance)
  instance.method = method
  instance.url = url
  var query
  if (params && typeof params === 'object') {
    query = urlStr(params)
    if (query !== '') instance.url = instance.url + '?' + query
  }
  return instance
}

/**
 * Sets request headers
 * @param {object} headers
 */
AX.headers = function (headers) {
  var instance = create(this)
  if (headers) instance._headersMap = Object.assign(instance._headersMap, headers)
  return instance
}
// methods
/**
 * AX[method] set request method and query url
 * @param {string} url - Url without any parameters
 * @param {object} params - Serializable object of url parameters, e. g. /api turns to /api?key=value
 */
AX.get = function (url, params = null) {
  return setUrlAndMethod(this, url, 'get', params)
}
AX.post = function (url, params = null) {
  return setUrlAndMethod(this, url, 'post', params)
}
AX.put = function (url, params = null) {
  return setUrlAndMethod(this, url, 'put', params)
}
AX.patch = function (url, params = null) {
  return setUrlAndMethod(this, url, 'patch', params)
}
AX.delete = function (url, params = null) {
  return setUrlAndMethod(this, url, 'delete', params)
}
// callbacks
/**
 * Sets response statuses which initiate callback
 * @example
 * {'success': [200, 201], error: ['!200', '!201'], 'yourcallbackname': 'all'} 
 * @param {object} st
 * @returns {AX}
 */
AX.status = function (st) {
  var instance = create(this)
  instance._statusesMap = Object.assign(instance._statusesMap, st)
  return instance
}

/**
 * Sets function for callback name
 * @param {string} state - Callback name
 * @param {function} fn - Function(responseBody, responseData)
 * @returns {AX}
 */
AX.on = function (state, fn) {
  var instance = create(this)
  instance._callbacksMap[state] = fn
  return instance
}

/**
  * Sends data. You should specify url and method by AX[method](url, queryparams) before.
  * This method has some shortcuts and in most cases it is used by itself when intends to send no data.
  * @param {string} data - Data to send
  * @param {string} contentType
  * @namespace AX
  * @name send
  */
Object.defineProperty(AX.prototype, 'send', {
  // Call .send() if you do not to send any data (or serialize data and define contentType manually)
  // Call .send.json(ObjectThatCanBeStringified) to send json
  // Call .send.text(ObjectWhichPropertiesArePrimitives) to send urlencoded query string
  // Call .send.form(FormDataObject) to send a FormData object
  get: function () {
    var ctx = this
    var method = function send (data, contentType = 'application/x-www-form-urlencoded') {
      if (typeof contentType === 'string' && !ctx._headersMap['Content-Type']) ctx._headersMap['Content-Type'] = contentType
      request(ctx, data)
    }
    method.text = function sendText (data) {
      method(urlStr(data), 'application/x-www-form-urlencoded')
    }
    method.json = function sendJSON (data) {
      data = JSON.stringify(data)
      method(data, 'application/json')
    }
    method.form = function sendFormData (data) {
      method(data, 'multipart/form-data')
    }
    return method
  },
  set: function (val) {
    return val
  }
})

AX.prototype.headers = AX.headers
AX.prototype.get = AX.get
AX.prototype.post = AX.post
AX.prototype.put = AX.put
AX.prototype.patch = AX.patch
AX.prototype.delete = AX.delete
AX.prototype.status = AX.status
AX.prototype.on = AX.on

export default AX
