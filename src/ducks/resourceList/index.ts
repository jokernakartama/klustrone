import { default as _resourceList } from './resourceList'
import {
  updateList as _updateList,
  updateResource as _updateResource,
  removeResource as _removeResource,
  deleteResource as _deleteResource,
  restoreResource as _restoreResource,
  renameResource as _renameResource,
  downloadResource as _downloadResource,
  publishResource as _publishResource,
  unpublishResource as _unpublishResource,
  pasteResource as _pasteResource,
  getList as _getList,
  makeDir as _makeDir,
  purgeTrash as _purgeTrash
} from './resourceList'

export const updateList = _updateList
export const updateResource = _updateResource
export const removeResource = _removeResource
export const deleteResource = _deleteResource
export const restoreResource = _restoreResource
export const renameResource = _renameResource
export const downloadResource = _downloadResource
export const publishResource = _publishResource
export const unpublishResource = _unpublishResource
export const pasteResource = _pasteResource
export const getList = _getList
export const makeDir = _makeDir
export const purgeTrash = _purgeTrash

const resourceList = _resourceList
export default resourceList
