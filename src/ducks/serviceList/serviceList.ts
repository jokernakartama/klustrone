import { serviceMap } from '~/api/index.js'
import { checkToken, putToken, removeToken } from '~/utils/tokenBag'

const initialState = {
}

Object.keys(serviceMap).forEach((serviceName) => {
  initialState[serviceName] = {
    name: serviceName,
    mounted: false
  }
})

export const SERVICE_MOUNT = 'servicepanel::service_mount'
export const SERVICE_UNMOUNT = 'servicepanel::service_unmount'

function setExpirationTime (Service, data) {
  const noRefreshBorder = Service.settings.noRefreshBorder
  let expiresAt = null
  if (noRefreshBorder && data['expires_in'] && data['expires_at'] && noRefreshBorder > data['expires_in']) {
    expiresAt = data['expires_at']
  }
  return expiresAt
}

export function mountService (serviceName: string, expiresAt = null) {
  return {
    type: SERVICE_MOUNT,
    meta: {
      crossTab: true
    },
    payload: {
      name: serviceName,
      expiresAt
    }
  }
}

export function unmountService (serviceName: string) {
  return {
    type: SERVICE_UNMOUNT,
    meta: {
      crossTab: true
    },
    payload: serviceName
  }
}

export function connectService (serviceName: string, callback?: (data?: token) => void) {
  return function (dispatch): void {
    const tokenData = checkToken(serviceName)
    if (tokenData) {
      serviceMap[serviceName].saveTokenData(tokenData, callback)
      const expiresAt = setExpirationTime(serviceMap[serviceName], tokenData)
      dispatch(mountService(serviceName, expiresAt))
      if (callback) callback(tokenData)
    }
  }
}

export function disconnectService (serviceName: string, callback?: () => void) {
  return function (dispatch): void {
    serviceMap[serviceName].revokeAuthorization(() => {
      dispatch(unmountService(serviceName))
      removeToken(serviceName)
      callback()
    })
  }
}

export function addService (serviceName: string, callback?: (data?: token) => void) {
  return function (dispatch) {
    serviceMap[serviceName].openAuthWindow((rawData, win) => {
      try {
        const parsed = rawData
        serviceMap[serviceName].getToken(parsed, () => {
          serviceMap[serviceName].saveTokenData(parsed, () => {
            putToken(serviceName, parsed)
            dispatch(connectService(serviceName, callback))
          })
        }, () => {
          // cannot get token
          // console.log('ERROR')
        })
      } catch (e) {
        // console.log(rawData, win, e)
      }
      win.close()
    })
  }
}

const actionsMap = {
  [SERVICE_MOUNT]: (state, action: IServiceListAction): IServiceListState => {
    const service = Object.assign({}, state[action.payload.name])
    service.mounted = true
    if (action.payload.expiresAt !== null) service.expiresAt = action.payload.expiresAt
    return {
      ...state,
      [action.payload.name]: service
    }
  },
  [SERVICE_UNMOUNT]: (state, action: IServiceListAction): IServiceListState => {
    const service = Object.assign({}, state[action.payload])
    service.mounted = false
    return {
      ...state,
      [action.payload]: service
    }
  },
}

export default function reducer (state = initialState, action: IServiceListAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
