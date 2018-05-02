import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as dux from '../view'
import reducer from '../view'
import { getKey } from '~/utils/session'

const createStore = configureStore([thunk])

describe('ducks/view.ts', function () {
  describe('setView', function () {
    it('should create an action to set view', function () {
      const view = dux.viewType.TILE
      const expected = {
        type: dux.VIEW_CHANGE,
        payload: view
      }
      expect(dux.setView(dux.viewType.TILE)).to.deep.equal(expected)
    })
  })
  describe('changeView', function () {
    it('should dispatch an action to set view and save the view\'s state in session storage', function () {
      const view = dux.viewType.LIST
      const store = createStore({ view: dux.viewType.TILE})
      const expected = {
        type: dux.VIEW_CHANGE,
        payload: view
      }
      store.dispatch(dux.changeView(view))
      const dispatchedActions = store.getActions()
      const savedSessionView = getKey(dux.VIEW_SETTINGS_KEY)
      expect(savedSessionView).to.equal(view)
      expect(dispatchedActions).to.deep.equal([expected])
    })
  })
  describe('view reducer', function () {
    it('should handle VIEW_CHANGE', function () {
      const view = dux.viewType.LIST
      const action = {
        type: dux.VIEW_CHANGE,
        payload: view
      }
      expect(reducer(dux.viewType.TILE, action)).to.equal(view)
    })
  })
})
