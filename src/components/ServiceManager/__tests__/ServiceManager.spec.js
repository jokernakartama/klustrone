import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ServiceManager from '../ServiceManager'
import { serviceMap } from '~/api'

const mockStore = configureStore([thunk])

describe('Component <ServiceManager />', () => {
  const active = 'cloud'
  const list = {
    cloud: {
      name: 'cloud',
      mounted: true
    }
  }
  const state = {
    services: {
      list
    }
  }
  let store
  beforeEach(() => {
    store = mockStore(state)
  })

  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<ServiceManager />, {
      context: { store }
    })
    expect(wrapper.props().list).to.deep.equal(state.services.list)
  })

  it('should render child components', () => {
    const ChildComponent = (props) => {
      return <div className='child-component'>Any content</div>
    }
    const wrapper = enzyme.shallow(<ServiceManager><ChildComponent /></ServiceManager>, {
      context: { store }
    })
    expect(wrapper.exists(ChildComponent)).to.be.true
  })

  it('should connect each service from service map on componentDidMount', () => {
    const dispatchSpy = sinon.spy()
    const didMountSpy = sinon.spy(ServiceManager.prototype, 'componentDidMount')
    store.dispatch = dispatchSpy
    const wrapper = enzyme.mount(<ServiceManager />, {
      context: { store }
    })
    const servicesCount = Object.keys(serviceMap).length
    const connectDispatchesCount = dispatchSpy.callCount
    expect(didMountSpy.calledOnce).to.equal(true)
    expect(connectDispatchesCount).to.equal(servicesCount)
  })
})
