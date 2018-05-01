import thunk from 'redux-thunk'
import * as dux from '../loading'
import reducer from '../loading'

describe('ducks/loading.ts', function() {
  describe('loadingStart', function() {
    it('should create an action to start loading', function () {
      const expected = {
        type: dux.LOADING_START
      }
      expect(dux.loadingStart()).to.deep.equal(expected)
    })
  })
  describe('loadingEnd', function() {
    it('should create an action to end loading', function () {
      const expected = {
        type: dux.LOADING_END
      }
      expect(dux.loadingEnd()).to.deep.equal(expected)
    })
  })
  describe('loading reducer', function() {
    it('should handle LOADING_START', function () {
      const action = dux.loadingStart()
      expect(reducer(false, action)).to.equal(true)
    })
    it('should handle LOADING_END', function () {
      const action = dux.loadingEnd()
      expect(reducer(true, action)).to.equal(false)
    })
  })
})
