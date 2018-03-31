import { checkToken } from '~/utils/tokenBag'
import { default as _CloudAPI } from './CloudAPI'
import { default as _GoogleDrive } from './GoogleDrive'
import { default as _YandexDisk } from './YandexDisk'
import { default as _Dropbox } from './Dropbox'

import { default as _sortList } from './sortList'
import { default as _getFileType } from './getFileType'
import { default as _parseLocation } from './parseLocation'
import { default as _createHref } from './createHref'
import { TRASH_URL_IDENTIFIER as _TRASH_URL_IDENTIFIER } from './parseLocation'

export const CloudAPI = _CloudAPI
export const GoogleDrive = _GoogleDrive
export const YandexDisk = _YandexDisk
export const Dropbox = _Dropbox
export const sortList = _sortList
export const getFileType = _getFileType
export const createHref = _createHref
export const parseLocation = _parseLocation
export const TRASH_URL_IDENTIFIER = _TRASH_URL_IDENTIFIER

const GOOGLE_DRIVE_NAME = GoogleDrive.settings.stateName
const YANDEX_DISK_NAME = YandexDisk.settings.stateName
const DROPBOX_NAME = Dropbox.settings.stateName

export const serviceMap = {
  [GOOGLE_DRIVE_NAME]: GoogleDrive,
  [YANDEX_DISK_NAME]: YandexDisk,
  [DROPBOX_NAME]: Dropbox
}

const switchService = function (service) {
  var Service = serviceMap[service]
  if (Service) {
    const tokenData = checkToken(service)
    if (tokenData) {
      // proper token data
      return Service
    } else {
      // corrupted token data or expired token
      return false
    }
  } else {
    // unknown service
    return null
  }
}

export default switchService
