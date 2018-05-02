import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as dux from '../resourceSelected'
import reducer from '../resourceSelected'

const createStore = configureStore([thunk])

describe('ducks/resourceSelected.ts', function() {
  describe('select', function() {
    it('should create an action to select resource', function () {
      const id = '1'
      const expected = {
        type: dux.RESOURCE_SELECT,
        payload: id
      }
      const action = dux.select(id)
      expect(action).to.deep.equal(expected)
    })
  })
  describe('deselect', function() {
    it('should dispatch an action to clear resource selection', function () {
      const store = createStore({
        resources: {
          selected: 'any'
        }
      })
      const expected = {
        type: dux.RESOURCE_SELECT,
        payload: null
      }
      store.dispatch(dux.deselect())
      const actions = store.getActions()
      expect(actions).to.deep.equal([expected])
    })
  })
  describe('resourceSelected reducer', function() {
    it('should handle RESOURCE_SELECT', function () {
      const id = '1'
      const expected = {
        type: dux.RESOURCE_SELECT,
        payload: id
      }
      const action = dux.select(id)
      expect(reducer(null, action)).to.equal(id)
    })
  })
})
