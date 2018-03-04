import { serviceMap } from '~/api/index.js'

interface IAction {
    type?: string
    payload?: any
}

const initialState = {
}

for (const service in serviceMap) {
 initialState[service] = {
   name: service,
   mounted: false
 }
}
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
   payload: {
     name: serviceName,
     expiresAt
   }
 }
}

export function unmountService (serviceName: string) {
 return {
   type: SERVICE_UNMOUNT,
   payload: serviceName
 }
}

/**
 * Connects service according token data
 * @param {string} serviceName
 * @returns {boolean}
 */
export function connectService (Service: ICloudAPI, tokenData: ITokenData, callback?: (data: ITokenData) => void) {
 return function (dispatch): void {
   Service.saveTokenData(tokenData, callback)
   const expiresAt = setExpirationTime(Service, tokenData)
   dispatch(mountService(Service.names().serviceName, expiresAt))
   if (callback) callback(tokenData)
 }
}

/**
 * Disonnects service
 * @param {string} serviceName
 * @returns {boolean}
 */
export function disconnectService (Service: ICloudAPI, callback?: () => void) {
 return function (dispatch): void {
   Service.revokeAuthorization(() => {
     dispatch(unmountService(Service.names().serviceName))
     callback()
   })
 }
}

/**
 * Connects service and adds new token data
 * recieved from an authorization window
 * @param {string} serviceName
 */

export function addService (Service: ICloudAPI, callback?: (data: ITokenData) => void) {
 return function (dispatch) {
   Service.openAuthWindow((rawData, win) => {
     try {
       var parsed = rawData
       Service.getToken(parsed, () => {
         Service.saveTokenData(parsed, () => {
           dispatch(connectService (Service, parsed, callback))
         })
       }, () => {
         // cannot get token
         console.log('ERROR')
       })
     } catch (e) {
       console.log(rawData, win, e)
     }
     win.close()
   })
 }
}

const actionsMap = {
 [SERVICE_MOUNT]: (state, action: IAction) => {
   const service = Object.assign({}, state[action.payload.name])
   service.mounted = true
   if (action.payload.expiresAt !== null) service.expiresAt = action.payload.expiresAt
   return {
     ...state,
     [action.payload.name]: service
   }
 },
 [SERVICE_UNMOUNT]: (state, action: IAction) => {
   const service = Object.assign({}, state[action.payload])
   service.mounted = false
   return {
     ...state,
     [action.payload]: service
   }
 },
}

export default function reducer (state = initialState, action: IAction = {}) {
 const fn = actionsMap[action.type]
 return fn ? fn(state, action) : state
}
