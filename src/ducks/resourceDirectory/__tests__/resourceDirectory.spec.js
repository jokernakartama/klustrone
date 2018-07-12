import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import * as dux from '../resourceDirectory'
import reducer from '../resourceDirectory'
import FakeCloudAPI from '~/api/FakeCloudAPI'
import { getFakeList, getFakeResource } from '~/api/FakeCloudAPI'

function getAPI (getState) {
  return FakeCloudAPI
}
const createStore = configureStore([thunk.withExtraArgument(getAPI)])

describe('ducks/resourceDirectory.ts', function () {
  describe('updateDir', function () {
    it('should create an action to update directory data', function () {
      const dir = { path: 'test' }
      const expected = {
        type: dux.RESOURCE_DIRECTORY_UPDATE,
        payload: dir
      }
      const action = dux.updateDir(dir)
      expect(action).to.deep.equal(expected)
    })
  })
  describe('getMeta', function () {
    it('should get directory path from store to recieve it\'s meta if the path is not specified', function (done) {
      const expectedPath = 'success'
      const dir = getFakeResource(true, { path: expectedPath, bamboocha: true })
      const store = createStore({
        resources: {
          dir
        },
        services: {
          [FakeCloudAPI.settings.stateName]: {
            mounted: true
          },
        },
        active: {
          service: FakeCloudAPI.settings.stateName
        }
      })
      store.dispatch(dux.getMeta())
        .then(function () {
          const newData = store.getActions()[0].payload
          expect(newData.path).to.equal(expectedPath)
          done()
        })
    })
  })
  describe('resourceDirectory reducer', function () {
    it('should handle RESOURCE_DIRECTORY_UPDATE', function () {
      const dir = { path: 'test' }
      const expected = {
        type: dux.RESOURCE_DIRECTORY_UPDATE,
        payload: dir
      }
      const action = dux.updateDir(dir)
      expect(reducer(null, action)).to.deep.equal(dir)
    })
  })
})
