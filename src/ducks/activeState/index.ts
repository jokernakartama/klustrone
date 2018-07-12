import { default as _activeState } from './activeState'
import {
  clearStates as _clearStates,
  updateStates as _updateStates
} from './activeState'

export const clearStates = _clearStates
export const updateStates = _updateStates

const activeState = _activeState
export default activeState
