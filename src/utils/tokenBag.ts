import * as session from './session'
import expirationTime from './expirationTime'
import { keys } from '~/constants'

export const TOKEN_BAG_PREFIX = keys.TOKEN_BAG_PREFIX

/**
 * Saves token in session storage.
 * @param {string} serviceName
 * @param {object} data - Token data {token: value, expires_in: value}
 */
export function putToken (serviceName: string, data: object): void {
  const key = TOKEN_BAG_PREFIX + serviceName
  if (data['expires_in'] === null) data['expires_in'] = 31536000
  data['expires_at'] = expirationTime(data['expires_in'])
  session.setKey(key, data)
}

/**
 * Obtains token from session storage
 * @param {string} serviceName
 * @returns {object} - Token data
 */
export function ejectToken (serviceName: string): ITokenData {
  const key = TOKEN_BAG_PREFIX + serviceName
  return session.getKey(key)
}

/**
 * Removes token from session storage
 * @param {string} serviceName
 */
export function removeToken (serviceName: string): void {
  const key = TOKEN_BAG_PREFIX + serviceName
  session.removeKey(key)
}

/**
 * Check service token availability in token bag
 * @param {string} service - Service name from service map
 * @returns {(object|boolean)} Returns false if token data is not proper (token is expired or absent)
 * else returns token data object
 */
export function checkToken (service: string): ITokenData|boolean {
  const tokenData = ejectToken(service)
  if (tokenData) {
    if (tokenData['expires_at']) {
      const now = expirationTime(0)
      const future = tokenData['expires_at']
      const hoard =  future - now
      if (hoard > 0) {
        return tokenData as ITokenData
      } else {
        // if token expiration makes the token inapplicable
        return false
      }
    } else {
      // even if token is not expired
      // expiration data absence says that token data in memory is corrupted
      return false
    }
  } else {
    // any token data is absent
    return false
  }
}
