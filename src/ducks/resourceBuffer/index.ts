import { default as _resourceBuffer } from './resourceBuffer'
import {
  updateBuffer as _updateBuffer,
  cutResource as _cutResource,
  copyResource as _copyResource
} from './resourceBuffer'

export const updateBuffer = _updateBuffer
export const copyResource = _copyResource
export const cutResource = _cutResource

const resourceBuffer = _resourceBuffer
export default resourceBuffer
