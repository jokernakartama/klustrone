import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as dux from '../resourceBuffer'
import reducer from '../resourceBuffer'
import { keys } from '~/constants'

const createStore = configureStore([thunk])

describe('ducks/resourceBuffer.ts', function() {
  describe('saveBuffer', function() {
    it('should save sort data in session storage', function () {
      const service = 'fake'
      const data = {
        id: 'any_id',
        path: '/',
        copy: false
      }
      const expected = JSON.stringify(data)
      dux.saveBuffer(data.id, data.path, service, data.copy)
      expect(window.sessionStorage[keys.BUFFER_PREFIX + service]).to.equal(expected)
    })
  })
  describe('updateBuffer', function() {
    it('should create an action to save resource data', function () {
      const id = 'any_id'
      const path = '/'
      const copy = false
      const service = 'fake'
      const payload = {
        id,
        path,
        service,
        copy
      }
      const expected = {
        type: dux.BUFFER_UPDATE,
        meta: {
          crossTab: true
        },
        payload
      }
      const created = dux.updateBuffer(payload.id, payload.path, payload.service, payload.copy)
      expect(created).to.deep.equal(expected)
    })
  })
  describe('cutResource', function() {
    it('should dispatch BUFFER_UPDATE with copy flag set to false', function () {
      const store = createStore({})
      store.dispatch(dux.cutResource('id', 'path', 'service'))
      const flag = store.getActions()[0].payload.copy
      expect(flag).to.be.false
    })
  })
  describe('should dispatch BUFFER_UPDATE with copy flag set to true', function() {
    it('should save sort data in session storage', function () {
      const store = createStore({})
      store.dispatch(dux.copyResource('id', 'path', 'service'))
      const flag = store.getActions()[0].payload.copy
      expect(flag).to.be.true
    })
  })
  describe('resourceBuffer reducer', function() {
    it('should handle BUFFER_UPDATE', function () {
      const id = 'any_id'
      const path = '/'
      const copy = false
      const service = 'fake'
      const payload = {
        id,
        path,
        service,
        copy
      }
      const expected = {
        [service]: {
          id,
          path,
          copy
        }
      }
      const action = {
        type: dux.BUFFER_UPDATE,
        payload
      }
      expect(reducer({}, action)).to.deep.equal(expected)
    })
  })
})
