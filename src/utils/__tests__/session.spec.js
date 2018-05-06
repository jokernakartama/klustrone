import * as session from '../session'

describe('utils/session.ts', function() {
  describe('session.start', function() {
    it('should return a promise to run a function asynchronously', function () {
      const func = sinon.spy()
      session.start()
        .then(function () {
          return func()
        })
        .then(function () {
          expect(func.called).to.equal(true)
        })
    })
  })
  describe('session.getKey', function() {
    it('should get data from sessionStorage by key', function () {
      const expected = {
        any: {
          deep: 'object',
          contains: 3,
          keys: true
        }
      }
      const key = 'anykey'
      window.sessionStorage[key] = JSON.stringify(expected)
      expect(session.getKey(key)).to.deep.equal(expected)
    })
  })
  describe('session.setKey', function() {
    it('should set data in session storage', function () {
      const otherTab = window.open(window.location.href, 'other window')
      const data = 1234
      const key = 'num'
      session.start()
        .then(function () {
          session.setKey(key, data)
          const expected = JSON.parse(window.sessionStorage[key])
          expect(expected).to.equal(data)
          expect(JSON.parse(otherTab.sessionStorage[key])).to.equal(data)
        })
    })
  })
  describe('session.removeKey', function() {
    it('should remove key from session storage', function () {
      const key = 'anykey'
      window.sessionStorage[key] = JSON.stringify('anydata')
      session.removeKey(key)
      expect(window.sessionStorage[key]).to.be.undefined
    })
  })
})