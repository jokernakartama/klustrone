import { default as _error } from './error'
import {
  throwError as _throwError,
  clearError as _clearError
} from './error'

export const throwError = _throwError
export const clearError = _clearError

const error = _error
export default error
