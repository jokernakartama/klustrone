import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as dux from '../serviceList'
import reducer from '../serviceList'
import FakeCloudAPI from '~/api/FakeCloudAPI'
import { fakeToken } from '~/api/FakeCloudAPI'
import expirationTime from '~/utils/expirationTime'
import { putToken, removeToken } from '~/utils/tokenBag'

const serviceName = 'fake'
const serviceMap = {
  [serviceName]: FakeCloudAPI
}

function getAPI (getState) {
  return FakeCloudAPI
}
const createStore = configureStore([thunk.withExtraArgument(getAPI)])

describe('ducks/serviceList.ts', function () {
  let store
  beforeEach(function () {
    store = createStore({
      services: {
        [serviceName]: {
          mounted: true,
          name: serviceName
        }
      }
    })
  })
  describe('mountService', function () {
    it('should create an action to mount service', function () {
      const serviceName = 'cloud'
      const expected = {
        type: dux.SERVICE_MOUNT,
        meta: {
          crossTab: true
        },
        payload: serviceName
      }
      expect(dux.mountService('cloud')).to.deep.equal(expected)
    })
  })

  describe('unmountService', function () {
    it('should create an action to unmount service', function () {
      const serviceName = 'cloud'
      const expected = {
        type: dux.SERVICE_UNMOUNT,
        meta: {
          crossTab: true
        },
        payload: serviceName
      }
      expect(dux.unmountService('cloud')).to.deep.equal(expected)
    })
  })
  describe('timerTick', function () {
    it('should dispatch an action to change expiration time', function () {
      const expiresAt = expirationTime(3000)
      store.dispatch(dux.timerTick(serviceName, expiresAt, serviceMap))
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.SERVICE_TIMER_TICK)
    })
    it('should dispatch SERVICE_UNMOUNT to disconnect service when time is expired', function () {
      const expiresAt = expirationTime(0)
      store.dispatch(dux.timerTick(serviceName, expiresAt, serviceMap))
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.SERVICE_UNMOUNT)
    })
  })
  describe('setTimer', function () {
    it('should dispatch an action to set timer', function () {
      const expiresAt = expirationTime(1)
      store.dispatch(dux.setTimer(serviceName, expiresAt, serviceMap))
      const action = store.getActions()[0]
      expect(action.type).to.equal(dux.SERVICE_SET_TIMER)
    })
  })
  describe('clearTimer', function () {
    it('should dispatch an action to clear timer', function () {
      const expected = {
        type: dux.SERVICE_CLEAR_TIMER,
        payload: serviceName
      }
      const expiresAt = expirationTime(1)
      store = createStore({
        services: {
          [serviceName]: {
            mounted: true,
            name: serviceName,
            timerId: 1
          }
        }
      })
      store.dispatch(dux.clearTimer(serviceName))
      const action = store.getActions()[0]
      expect(action).to.deep.equal(expected)
    })
  })
  describe('connectService', function () {
    const token = 'token'
    afterEach(function () {
      removeToken(serviceName)
    })
    it('should dispatch actions to connect service', function () {
      const tokenData = fakeToken(serviceName, 100, token)
      putToken(serviceName, tokenData)
      store = createStore({
        services: {
          [serviceName]: {
            mounted: false,
            name: serviceName,
          }
        }
      })
      store.dispatch(dux.connectService(serviceName, serviceMap))
      const actions = store.getActions()
      expect(actions[0].type).to.equal(dux.SERVICE_SET_TIMER)
      expect(actions[1].type).to.equal(dux.SERVICE_TIMER_TICK)
      expect(actions[2].type).to.equal(dux.SERVICE_MOUNT)
    })
    it('should not connect service if it was already connected', function () {
      const tokenData = fakeToken(serviceName, null, token)
      putToken(serviceName, tokenData)
      store.dispatch(dux.connectService(serviceName, serviceMap))
      const actions = store.getActions()
      expect(actions).to.have.length(0)
    })
  })
  describe('disconnectService', function () {
    it('should dispatch SERVICE_UNMOUNT to disconnect service', function () {
      store.dispatch(dux.disconnectService(serviceName, serviceMap))
      const expected = {
        type: dux.SERVICE_UNMOUNT,
        payload: serviceName,
      }
      const action = store.getActions()[0]
      expect(action).to.deep.include(expected)
    })
  })
  describe('addService', function () {
    it('should open window to authorize user', function () {
      const openWinSpy = sinon.spy(FakeCloudAPI ,'openAuthWindow')
      store.dispatch(dux.addService(serviceName, serviceMap))
      expect(openWinSpy.called).to.be.true
    })
  })
  describe('serviceList reducer', function() {
    it('should handle SERVICE_MOUNT', function () {
      const action = {
        type: dux.SERVICE_MOUNT,
        payload: serviceName
      }
      const expected = {
        [serviceName]: {
          mounted: true
        }
      }
      expect(reducer({}, action)).to.deep.equal(expected)
    })
    it('should handle SERVICE_UNMOUNT', function () {
      const action = {
        type: dux.SERVICE_UNMOUNT,
        payload: serviceName
      }
      const expected = {
        [serviceName]: {
          mounted: false
        }
      }
      expect(reducer({}, action)).to.deep.equal(expected)
    })
    it('should handle SERVICE_TIMER_TICK', function () {
      const timePerc = 100
      const action = {
        type: dux.SERVICE_TIMER_TICK,
        payload: {
          name: serviceName,
          time: timePerc
        }
      }
      const expected = {
        [serviceName]: {
          expiresPerc: timePerc
        }
      }
      expect(reducer({}, action)).to.deep.equal(expected)
    })
    it('should handle SERVICE_SET_TIMER', function () {
      const timerId = 1
      const action = {
        type: dux.SERVICE_SET_TIMER,
        payload: {
          name: serviceName,
          id: timerId
        }
      }
      const expected = {
        [serviceName]: {
          timerId
        }
      }
      expect(reducer({}, action)).to.deep.equal(expected)
    })
    it('should handle SERVICE_CLEAR_TIMER', function () {
      const action = {
        type: dux.SERVICE_CLEAR_TIMER,
        payload: serviceName
      }
      const expected = {
        [serviceName]: {}
      }
      expect(reducer({}, action)).to.deep.equal(expected)
    })
  })
})
