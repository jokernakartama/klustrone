import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as dux from '../sort'
import reducer from '../sort'
import { getKey } from '~/utils/session'

const createStore = configureStore([thunk])

describe('ducks/sort.ts', function() {
  describe('sortResourcesList', function() {
    it('should dispatch an action to change sort settings and save the settings\'s state in session storage', function () {
      const store = createStore({})
      const field = 'name'
      const asc = false
      const expected = {
        type: dux.RESOURCES_SORT_CHANGE,
        payload: {
          field,
          asc
        }
      }
      store.dispatch(dux.sortResourcesList(field, asc))
      const savedSessionSort = getKey(dux.SORTING_SETTINGS_KEY)
      const actions = store.getActions()
      expect(savedSessionSort).to.deep.equal(expected.payload)
      expect(actions).to.deep.equal([expected])
    })
  })
  describe('sort reducer', function () {
    it('should handle RESOURCES_SORT_CHANGE', function () {
      const field = 'size'
      const asc = true
      const payload = {
        field,
        asc
      }
      const action = {
        type: dux.RESOURCES_SORT_CHANGE,
        payload
      }
      expect(reducer({}, action)).to.deep.equal(payload)
    })
  })
})
