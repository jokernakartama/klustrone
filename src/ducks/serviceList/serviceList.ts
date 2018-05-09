import { serviceMap as defaultServiceMap  } from '~/api/index.js'
import { checkToken, putToken, removeToken } from '~/utils/tokenBag'
import expirationTime from '~/utils/expirationTime'
import { appError } from '~/ducks/modal'

const initialState = {
}

Object.keys(defaultServiceMap).forEach((serviceName) => {
  initialState[serviceName] = {
    name: serviceName,
    mounted: false
  }
})

export const SERVICE_MOUNT = 'service::service_mount'
export const SERVICE_UNMOUNT = 'service::service_unmount'
export const SERVICE_SET_TIMER = 'service::service_set_timer'
export const SERVICE_CLEAR_TIMER = 'service::service_clear_timer'
export const SERVICE_TIMER_TICK = 'service::service_timer_tick'

function setExpirationTime (Service: ICloudAPI, data: ITokenData) {
  const settings = Service.settings as IAPISettings
  let expiresAt = null
  if (settings.tokenLifeTime && data['expires_in'] && data['expires_at'] && settings.tokenLifeTime >= data['expires_in']) {
    expiresAt = data['expires_at']
  }
  return expiresAt
}

/**
 * As this crosstab action creator itself does not run other side effects,
 * there should be componentDidUpdate method somewhere in containers that triggers them.
 */
export function mountService (serviceName: string) {
  return {
    type: SERVICE_MOUNT,
    meta: {
      crossTab: true
    },
    payload: serviceName
  }
}

/**
 * As this crosstab action creator itself does not cancel other side effects,
 * there should be componentDidUpdate method somewhere in containers that does this.
 */
export function unmountService (serviceName: string) {
  return {
    type: SERVICE_UNMOUNT,
    meta: {
      crossTab: true
    },
    payload: serviceName
  }
}

/**
 * Sets new value for expiration timer.
 * If time is expired, disconnects service.
 * @param {string} serviceName
 * @param {number} expiresAt
 * @param {object} serviceMap
 * @returns {function} - Action creator
 */
export function timerTick (serviceName: string, expiresAt: number, serviceMap: IServiceMap = defaultServiceMap) {
  return function (dispatch) {
    const time = expiresAt - expirationTime(0)
    const settings = serviceMap[serviceName].settings as IAPISettings
    const timePerc = Math.round(time / settings.tokenLifeTime * 100)
    if (time > 0) {
      dispatch({
        type: SERVICE_TIMER_TICK,
        payload: {
          name: serviceName,
          time: timePerc
        }
      })
    } else {
      dispatch(disconnectService(serviceName, serviceMap))
    }
  }
}

/**
 * Sets timer to decrease expiration time each second.
 * @param {string} serviceName
 * @param {number} expiresAt
 * @param {object} serviceMap
 * @returns {function} - Action creator
 */
export function setTimer (serviceName: string, expiresAt: number, serviceMap: IServiceMap = defaultServiceMap) {
  return function (dispatch) {
    dispatch(clearTimer(serviceName))
    const settings = serviceMap[serviceName].settings as IAPISettings
    if (expiresAt !== null && expiresAt > 0 && settings.tokenLifeTime) {
      const tickTime = Math.round(settings.tokenLifeTime / 100)
      const tick = () => dispatch(timerTick(serviceName, expiresAt, serviceMap))
      const timerId = window.setInterval(tick, tickTime * 1000)
      dispatch({
        type: SERVICE_SET_TIMER,
        payload: {
          name: serviceName,
          id: timerId
        }
      })
      tick()
    }
  }
}

/**
 * Clears timer if it exists.
 * @param {string} serviceName
 * @returns {function} - Action creator
 */
export function clearTimer (serviceName: string) {
  return function (dispatch, getState) {
    const list = getState().services.list
    if (list[serviceName] && list[serviceName].timerId) {
      window.clearInterval(list[serviceName].timerId)
      dispatch({
        type: SERVICE_CLEAR_TIMER,
        payload: serviceName
      })
    }
  }
}

/**
 * Checks the service availability for connection.
 * @param {string} serviceName
 * @param {object} serviceMap
 * @returns {(null|number)} - setInterval ID
 */
export function connectService (serviceName: string, serviceMap: IServiceMap = defaultServiceMap) {
  return function (dispatch, getState): void {
    const tokenData = checkToken(serviceName)
    if (tokenData) {
      serviceMap[serviceName].saveTokenData(tokenData as ITokenData)
      const expiresAt = setExpirationTime(serviceMap[serviceName], tokenData as ITokenData)
      dispatch(setTimer(serviceName, expiresAt, serviceMap))
      const state = getState().services
      // When the crosstab action is used, it normally mounts a service before
      // this action creator runs, so there is no need to mount the service again
      if (state.list[serviceName] && !state.list[serviceName].mounted) {
        dispatch(mountService(serviceName))
      }
    }
  }
}

/**
 * Unmounts the service and clears its timer (if used), then removes the service token.
 * @param {string} serviceName
 * @param {object} serviceMap
 * @returns {function} - Action creator
 */
export function disconnectService (serviceName: string, serviceMap: IServiceMap = defaultServiceMap) {
  return function (dispatch, getState): void {
    const state = getState().services
    serviceMap[serviceName].revokeAuthorization(() => {
      dispatch(clearTimer(serviceName))
      // When the crosstab action is used, it normally unmounts a service before
      // this action creator runs, so there is no need to unmount the service again
      if (state.list[serviceName] && state.list[serviceName].mounted) {
        dispatch(unmountService(serviceName))
      }
      // the token removes from all tabs
      removeToken(serviceName)
    })
  }
}

/**
 * Opens a service authorization window.
 * @param {string} serviceName
 * @param {object} serviceMap
 * @returns {function} - Action creator
 */
export function addService (serviceName: string, serviceMap: IServiceMap = defaultServiceMap) {
  return function (dispatch) {
    serviceMap[serviceName].openAuthWindow((rawData, win) => {
      try {
        const parsed = rawData
        serviceMap[serviceName].getToken(parsed, () => {
          dispatch(disconnectService(serviceName))
          serviceMap[serviceName].saveTokenData(parsed, () => {
            putToken(serviceName, parsed)
            dispatch(connectService(serviceName, serviceMap))
          })
        }, () => {
          appError(dispatch)('Cannot get token from recieved url')
        })
      } catch (e) {
        appError(dispatch)('Caught exception while getting token')
      }
      win.close()
    })
  }
}

const actionsMap = {
  [SERVICE_MOUNT]: (state: IServiceListState, action: IServiceListAction): IServiceListState => {
    const service = Object.assign({}, state[action.payload])
    service.mounted = true
    return {
      ...state,
      [action.payload]: service
    }
  },
  [SERVICE_UNMOUNT]: (state: IServiceListState, action: IServiceListAction): IServiceListState => {
    const service = Object.assign({}, state[action.payload])
    service.mounted = false
    return {
      ...state,
      [action.payload]: service
    }
  },
  [SERVICE_TIMER_TICK]: (state: IServiceListState, action: IServiceListAction): IServiceListState => {
    const service = Object.assign({}, state[action.payload.name])
    service.expiresPerc = action.payload.time
    return {
      ...state,
      [action.payload.name]: service
    }
  },
  [SERVICE_SET_TIMER]: (state: IServiceListState, action: IServiceListAction): IServiceListState => {
    const service = Object.assign({}, state[action.payload.name])
    service.timerId = action.payload.id
    return {
      ...state,
      [action.payload.name]: service
    }
  },
  [SERVICE_CLEAR_TIMER]: (state: IServiceListState, action: IServiceListAction): IServiceListState => {
    const service = Object.assign({}, state[action.payload])
    delete service.timerId
    delete service.expiresPerc
    return {
      ...state,
      [action.payload]: service
    }
  }
}

export default function reducer (state: IServiceListState = initialState, action: IServiceListAction = {}) {
  const fn = actionsMap[action.type]
  return fn ? fn(state, action) : state
}
