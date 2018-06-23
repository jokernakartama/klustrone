import { TRASH_URL_IDENTIFIER } from './index.js'
import { APPLICATION_SERVER_DIRECTORY } from '~/utils/history'

export const DIR_TYPE = 'dir'
export const ROOT_TYPE = 'rootlink'
export const TRASH_TYPE = 'trashlink'

/**
 * @param {string} path - A resource path without slash at the beginning
 * @param {string} type
 */

export default function createHref (path, service, type = DIR_TYPE, isTrash = false) {
  if ((type === DIR_TYPE && !isTrash) || type === ROOT_TYPE || type === TRASH_TYPE) {
    const href = APPLICATION_SERVER_DIRECTORY + service + ':' + (isTrash ? TRASH_URL_IDENTIFIER : '') + '/' + path
    return href
  } else {
    return undefined
  }
}
