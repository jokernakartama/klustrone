import { default as _modal } from './modal'
import {
  openDialog as _openDialog,
  closeDialog as _closeDialog,
  openModal as _openModal,
  closeModal as _closeModal,
  appInfo as _appInfo,
  appError as _appError,
  appWarning as _appWarning,
  appConfirm as _appConfirm,
  appPrompt as _appPrompt
} from './modal'

export const openDialog = _openDialog
export const closeDialog = _closeDialog
export const openModal = _openModal
export const closeModal = _closeModal
export const appInfo = _appInfo
export const appError = _appError
export const appWarning = _appWarning
export const appConfirm = _appConfirm
export const appPrompt = _appPrompt

const modal = _modal
export default modal
