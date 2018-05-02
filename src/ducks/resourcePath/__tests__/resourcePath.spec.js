import thunk from 'redux-thunk'
import * as dux from '../resourcePath'
import reducer from '../resourcePath'

describe('ducks/resourcePath.ts', function() {
  describe('updateResourcePath', function() {
    it('should create an action to update trash flag', function () {
      const path = 'test'
      const expected = {
        type: dux.RESOURCES_PATH_UPDATE,
        payload: path
      }
      const action = dux.updateResourcePath(path)
      expect(action).to.deep.equal(expected)
    })
  })
  describe('resourcePath reducer', function() {
    it('should handle RESOURCES_PATH_UPDATE', function () {
      const path = 'test'
      const expected = {
        type: dux.RESOURCES_PATH_UPDATE,
        payload: path
      }
      const action = dux.updateResourcePath(path)
      expect(reducer('', action)).to.equal(path)
    })
  })
})
