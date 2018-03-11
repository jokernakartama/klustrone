import { serviceMap } from '~/api/index.js'
import { checkToken, putToken } from '~/utils/tokenBag'

const initialState = {
}

Object.keys(serviceMap).map((serviceName) => {
  initialState[serviceName] = {
    name: serviceName,
    mounted: false
  }
})

const SERVICE_MOUNT = 'servicepanel::service_mount'
const SERVICE_UNMOUNT = 'servicepanel::service_unmount'

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

export function connectService (Service: ICloudAPI, callback?: (data?: token) => void) {
 return function (dispatch): void {
   const name = Service.names['serviceName']
   const tokenData = checkToken(name)
   if (tokenData) {
     Service.saveTokenData(tokenData, callback)
     const expiresAt = setExpirationTime(Service, tokenData)
     dispatch(mountService(name, expiresAt))
     if (callback) callback(tokenData)
   }
 }
}

export function disconnectService (Service: ICloudAPI, callback?: () => void) {
 return function (dispatch): void {
   Service.revokeAuthorization(() => {
     const name = Service.names['serviceName']
     dispatch(unmountService(name))
     callback()
   })
 }
}

export function addService (Service: ICloudAPI, callback?: (data?: token) => void) {
 return function (dispatch) {
   Service.openAuthWindow((rawData, win) => {
     try {
       const parsed = rawData
       const name = Service.names['serviceName']
       Service.getToken(parsed, () => {
         Service.saveTokenData(parsed, () => {
           putToken(name, parsed)
           dispatch(connectService (Service, callback))
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
