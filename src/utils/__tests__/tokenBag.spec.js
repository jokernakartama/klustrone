import {
  putToken,
  ejectToken,
  removeToken,
  checkToken,
  TOKEN_BAG_PREFIX
} from '../tokenBag'
import { fakeToken } from '~/api/FakeCloudAPI'
import expirationTime from '~/utils/expirationTime'

const serviceName = 'fake'
const token = 'token'

describe('utils/tokenBag.ts', function () {
  describe('putToken', function () {
    it('should set expiration time if it is not provided', function () {
      const tokenData = fakeToken(serviceName, null, token)
      putToken(serviceName, tokenData)
      const saved = JSON.parse(window.sessionStorage[TOKEN_BAG_PREFIX + serviceName])
      expect(saved['expires_in']).to.exist
    })
  })
  describe('ejectToken', function () {
    it('should obtain token data from session storage', function () {
      const tokenData = fakeToken(serviceName, null, token)
      window.sessionStorage[TOKEN_BAG_PREFIX + serviceName] = JSON.stringify(tokenData)
      const ejected = ejectToken(serviceName)
      expect(ejected).to.deep.equal(tokenData)
    })
  })
  describe('removeToken', function () {
    it('should remove token data from session storage', function () {
      const tokenData = fakeToken(serviceName, null, token)
      window.sessionStorage[TOKEN_BAG_PREFIX + serviceName] = JSON.stringify(tokenData)
      removeToken(serviceName)
      expect(window.sessionStorage[TOKEN_BAG_PREFIX + serviceName]).to.be.undefined
    })
  })
  describe('checkToken', function () {
    it('should return false if token data is corrupted', function () {
      window.sessionStorage[TOKEN_BAG_PREFIX + serviceName] = '{}'
      const result = checkToken(serviceName)
      expect(result).to.be.false
    })
    it('should return false if token is expired', function () {
      const expiresAt = expirationTime(0)
      window.sessionStorage[TOKEN_BAG_PREFIX + serviceName] = JSON.stringify(fakeToken(serviceName, expiresAt, token))
      const result = checkToken(serviceName)
      expect(result).to.be.false
    })
    it('should return false if token data has no "expires_at" key', function () {
      const tokenData = fakeToken(serviceName, null, token)
      delete tokenData['expires_at']
      window.sessionStorage[TOKEN_BAG_PREFIX + serviceName] = JSON.stringify(tokenData)
      const result = checkToken(serviceName)
      expect(result).to.be.false
    })
  })
})
