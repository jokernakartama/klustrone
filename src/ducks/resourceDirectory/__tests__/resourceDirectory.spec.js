import thunk from 'redux-thunk'
import * as dux from '../resourceDirectory'
import reducer from '../resourceDirectory'

describe('ducks/resourceDirectory.ts', function() {
  describe('updateDir', function() {
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
  describe('resourceDirectory reducer', function() {
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
