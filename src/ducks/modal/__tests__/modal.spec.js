import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as dux from '../modal'
import reducer from '../modal'

const createStore = configureStore([thunk])

describe('ducks/modal.ts', function() {
  describe('openModal', function() {
    it('should create an action to open modal window', function () {
      const type = 'info'
      const message = 'information message'
      const title = 'the title'
      const data = true
      const accept = 'OK'
      const decline = 'CANCEL'
      const expected = {
        type: dux.MODAL_OPEN,
        payload: {
          type,
          message,
          title,
          data,
          accept,
          decline
        }
      }
      const action = dux.openModal(type, message, data, title, accept, decline)
      expect(action).to.deep.equal(expected)
    })
  })
  describe('closeModal', function() {
    it('should create an action to close modal window', function () {
      const expected = {
        type: dux.MODAL_CLOSE
      }
      expect(dux.closeModal()).to.deep.equal(expected)
    })
  })
  describe('openDialog', function() {
    const type = 'info'
    const message = 'information message'
    const title = 'the title'
    const data = true
    const accept = 'OK'
    const decline = 'CANCEL'

    it('should dispatch an action to open modal window', function () {
      const store = createStore({ modal: false })
      const expected = {
        type: dux.MODAL_OPEN,
        payload: {
          type,
          message,
          title,
          data,
          accept,
          decline
        }
      }
      store.dispatch(dux.openDialog(type, message, data, { accept, decline, title }))
      const dispatchedActions = store.getActions()
      expect(dispatchedActions).to.deep.equal([expected])
    })
    // it('should dispatch an action to open modal window', function () {
    //   store.dispatch(dux.openDialog(type, message, data, { accept, decline, title }))
    //   const dispatchedActions = store.getActions()
    //   expect(dispatchedActions).to.deep.equal([expected])
    // })
  })
  describe('closeDialog', function() {
    it('should dispatch an action to close modal window', function () {
      const store = createStore({})
      const expected = {
        type: dux.MODAL_CLOSE
      }
      store.dispatch(dux.closeDialog())
      const dispatchedActions = store.getActions()

      expect(dispatchedActions).to.deep.equal([expected])
    })
  })
  describe('appInfo', function() {
    it('should dispatch an action with proper type argument', function () {
      const store = createStore({})
      const expected = 'info'
      dux.appInfo(store.dispatch)()
      const dialogType = store.getActions()[0].payload.type
      expect(dialogType).to.equal(expected)
    })
  })
  describe('appError', function() {
    it('should dispatch an action with proper type argument', function () {
      const store = createStore({})
      const expected = 'error'
      dux.appError(store.dispatch)()
      const dialogType = store.getActions()[0].payload.type
      expect(dialogType).to.equal(expected)
    })
  })
  describe('appWarning', function() {
    it('should dispatch an action with proper type argument', function () {
      const store = createStore({})
      const expected = 'warning'
      dux.appWarning(store.dispatch)()
      const dialogType = store.getActions()[0].payload.type
      expect(dialogType).to.equal(expected)
    })
  })
  describe('appPrompt', function() {
    it('should dispatch an action with proper type argument', function () {
      const store = createStore({})
      const expected = 'prompt'
      dux.appPrompt(store.dispatch)()
      const dialogType = store.getActions()[0].payload.type
      expect(dialogType).to.equal(expected)
    })
  })
  describe('appConfirm', function() {
    it('should dispatch an action with proper type argument', function () {
      const store = createStore({})
      const expected = 'confirm'
      dux.appConfirm(store.dispatch)()
      const dialogType = store.getActions()[0].payload.type
      expect(dialogType).to.equal(expected)
    })
  })
  describe('modal reducer', function() {
    const type = 'info'
    const message = 'information message'
    const title = 'the title'
    const data = true
    const accept = 'OK'
    const decline = 'CANCEL'
    const state = {
      type,
      message,
      title,
      data,
      accept,
      decline
    }
    it('should handle MODAL_OPEN', function () {
      const action = dux.openModal(type, message, data, title, accept, decline)
      expect(reducer(false, action)).to.deep.equal(state)
    })
    it('should handle MODAL_CLOSE', function () {
      const action = dux.closeModal()
      expect(reducer(state, action)).to.equal(false)
    })
  })
})
