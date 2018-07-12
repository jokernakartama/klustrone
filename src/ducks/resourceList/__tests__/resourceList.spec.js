import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as dux from '../resourceList'
import reducer from '../resourceList'
import FakeCloudAPI from '~/api/FakeCloudAPI'
import { getFakeList, getFakeResource } from '~/api/FakeCloudAPI'

function getAPI (getState) {
  return FakeCloudAPI
}
const createStore = configureStore([thunk.withExtraArgument(getAPI)])

describe('ducks/resourceList.ts', function () {
  let store
  beforeEach(function () {
    store = createStore({
      buffer: {
        isCopy: true
      },
      active: {
        service: FakeCloudAPI.settings.stateName
      },
      resources: {
        list: null,
        dir: getFakeResource(true, { path: 'success' })
      }
    })
  })
  describe('updateList', function () {
    it('should return an action to update list', function () {
      const list = {}
      const expected = {
        type: dux.RESOURCE_LIST_UPDATE,
        payload: list
      }
      expect(dux.updateList({})).to.deep.equal(expected)
    })
  })
  describe('updateResource', function () {
    it('should be tested', function () {
      const data = {
        id: 'a1b2',
        value: {
          publicLink: null
        }
      }
      const expected = {
        type: dux.RESOURCE_UPDATE,
        payload: data
      }
      expect(dux.updateResource(data)).to.deep.equal(expected)
    })
  })
  describe('getList', function () {
    it('should dispatch RESOURCE_LIST_UPDATE on success', function () {
      store.dispatch(dux.getList('success', false))
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.RESOURCE_LIST_UPDATE)
    })
  })
  describe('removeResource', function() {
    it('should dispatch RESOURCE_LIST_UPDATE on success', function () {
      store.dispatch(dux.removeResource('success', false))
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.RESOURCE_LIST_UPDATE)
    })
  })
  describe('deleteResource', function () {
    it('should dispatch RESOURCE_LIST_UPDATE on success', function () {
      store.dispatch(dux.deleteResource('success'))
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.RESOURCE_LIST_UPDATE)
    })
  })
  describe('restoreResource', function () {
    it('should dispatch RESOURCE_LIST_UPDATE on success', function () {
      store.dispatch(dux.restoreResource('success', false))
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.RESOURCE_LIST_UPDATE)
    })
  })
  describe('purgeTrash', function() {
    it('should dispatch RESOURCE_LIST_UPDATE on success', function () {
      store.dispatch(dux.purgeTrash())
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.RESOURCE_LIST_UPDATE)
    })
  })
  describe('publishResource', function () {
    it('should dispatch RESOURCE_UPDATE on success to set public link', function () {
      store.dispatch(dux.publishResource('success'))
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.RESOURCE_UPDATE)
      expect(action.payload.value.publicLink).to.equal('success')
    })
  })
  describe('unpublishResource', function () {
    it('should dispatch RESOURCE_UPDATE on success to clear public link', function () {
      store.dispatch(dux.unpublishResource('success'))
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.RESOURCE_UPDATE)
      expect(action.payload.value.publicLink).to.equal('success')
    })
  })
  describe('renameResource', function () {
    it('should dispatch RESOURCE_UPDATE on success to change resource name', function () {
      const newName = 'othername'
      store.dispatch(dux.renameResource('success', newName))
      const action = store.getActions()[0]
      expect(action.payload.value).to.equal(newName)
      expect(action.type).to.equal(dux.RESOURCE_UPDATE)
    })
  })
  describe('pasteResource', function () {
    it('should dispatch RESOURCE_LIST_UPDATE on success', function () {
      store.dispatch(dux.pasteResource('success'))
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.RESOURCE_LIST_UPDATE)
    })
  })
  describe('makeDir', function () {
    it('should dispatch RESOURCE_UPDATE on success to change resource name', function () {
      const newDir = 'a_new_dir'
      store.dispatch(dux.makeDir(newDir))
      const action = store.getActions()[0]
      expect(action.payload.value.name).to.equal(newDir)
      expect(action.type).to.equal(dux.RESOURCE_UPDATE)
    })
  })
  describe('resourceList reducer', function () {
    it('should handle RESOURCE_LIST_UPDATE', function () {
      const list = getFakeList()
      const action = {
        type: dux.RESOURCE_LIST_UPDATE,
        payload: list
      }
      expect(reducer({}, action)).to.deep.equal(list)
    })
    it('should handle RESOURCE_UPDATE', function () {
      const resource = getFakeResource(false, { name: 'newResource' })
      const list = getFakeList()
      const expected = Object.assign({}, list, { [resource.id]: resource })
      const action = {
        type: dux.RESOURCE_UPDATE,
        payload: {
          id: resource.id,
          value: resource
        }
      }
      expect(reducer(list, action)).to.deep.equal(expected)
    })
  })
})
