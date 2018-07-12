import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as dux from '../activeState'
import reducer from '../activeState'

const createStore = configureStore([thunk])

describe.only('ducks/activeState.ts', () => {
  describe('clearStates', function () {
    it('should create an action to reset an active path, a service and a trash flag', () => {
      const expected = {
        type: dux.ACTIVESTATE_CLEAR
      }
      expect(dux.clearStates()).to.deep.equal(expected)
    })
  })
  describe('updateStates', function () {
    it('should create an action to update an active path, a service or a trash flag', () => {
      const payload = {
        service: 'anyService',
        path: 'mydir/mysubdir',
        isTrash: false
      }
      const expected = {
        type: dux.ACTIVESTATE_UPDATE,
        payload
      }
      expect(dux.updateStates(payload)).to.deep.equal(expected)
    })
  })
  describe('activeState reducer', function () {
    it('should handle ACTIVESTATE_CLEAR', function () {
      const expected = {
        service: null,
        path: '',
        isTrash: false
      }
      const action = dux.clearStates()
      expect(reducer({}, action)).to.deep.equal(expected)
    })
    it('should handle ACTIVESTATE_UPDATE', function () {
      const expected = {
        service: 'anyOtherService',
        path: 'yourdir/yoursubdir',
        isTrash: false
      }
      const action = dux.updateStates(expected)
      expect(reducer({}, action)).to.deep.equal(expected)
    })
  })
})
