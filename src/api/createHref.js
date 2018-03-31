import { TRASH_URL_IDENTIFIER } from './index.js'
import { APPLICATION_SERVER_DIRECTORY } from '~/utils/history'

/**
 * @param {string} path - A resource path without slash at the beginning
 * @param {string} type
 */

export default function createHref (path, service, type, isTrash) {
  if ((type === 'dir' && !isTrash) || type === 'rootlink') {
    const href = APPLICATION_SERVER_DIRECTORY + service + ':' + (isTrash ? TRASH_URL_IDENTIFIER : '') + '/' + path
    return href
  } else {
    return undefined
  }
}
