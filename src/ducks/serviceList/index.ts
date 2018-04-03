import { default as _serviceList } from './serviceList'
import {
  mountService as _mountService,
  unmountService as _unmountService,
  addService as _addService,
  connectService as _connectService,
  disconnectService as _disconnectService
} from './serviceList'

export const mountService = _mountService
export const unmountService = _unmountService
export const addService = _addService
export const connectService = _connectService
export const disconnectService = _disconnectService

const serviceList = _serviceList
export default serviceList
