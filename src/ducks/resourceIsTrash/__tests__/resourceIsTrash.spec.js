import thunk from 'redux-thunk'
import * as dux from '../resourceIsTrash'
import reducer from '../resourceIsTrash'

describe('ducks/resourceIsTrash.ts', function() {
  describe('resourceIsTrash', function() {
    it('should create an action to update trash flag', function () {
      const isTrash = true
      const expected = {
        type: dux.RESOURCES_TRASH_FLAG_UPDATE,
        payload: isTrash
      }
      const action = dux.updateTrashFlag(isTrash)
      expect(action).to.deep.equal(expected)
    })
  })
  describe('resourceIsTrash reducer', function() {
    it('should handle RESOURCES_TRASH_FLAG_UPDATE', function () {
      const isTrash = false
      const expected = {
        type: dux.RESOURCES_TRASH_FLAG_UPDATE,
        payload: isTrash
      }
      const action = dux.updateTrashFlag(isTrash)
      expect(reducer(true, action)).to.equal(isTrash)
    })
  })
})
