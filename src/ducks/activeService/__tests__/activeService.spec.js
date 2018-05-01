import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as dux from '../activeService'
import reducer from '../activeService'

const createStore = configureStore([thunk])

describe('ducks/activeService.ts', function () {
  describe('selectService', function () {
    it('should create an action to select service', () => {
      const serviceName = 'cloud'
      const expected = {
        type: dux.SERVICE_SELECT,
        payload: serviceName
      }
      expect(dux.selectService(serviceName)).to.deep.equal(expected)
    })
  })
  describe('clearServiceSelection', function () {
    it('should create an action to clear service selection', () => {
      const serviceName = 'cloud'
      const expected = {
        type: dux.SERVICE_CLEAR
      }
      expect(dux.clearServiceSelection()).to.deep.equal(expected)
    })
  })
  describe('activeService reducer', function () {
    it('should handle SERVICE_SELECT', function () {
      const expected = 'cloud'
      const action = dux.selectService(expected)
      expect(reducer(null, action)).to.equal(expected)
    })
    it('should handle SERVICE_CLEAR', function () {
      const action = dux.clearServiceSelection()
      expect(reducer('cloud', action)).to.equal(null)
    })
  })
})
