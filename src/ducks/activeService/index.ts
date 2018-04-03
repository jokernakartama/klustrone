import { default as _activeService } from './activeService'
import {
  selectService as _selectService,
  clearServiceSelection as _clearServiceSelection
} from './activeService'

export const selectService = _selectService
export const clearServiceSelection = _clearServiceSelection

const activeService = _activeService
export default activeService
