import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ServiceList from '../ServiceList'

const createStore = configureStore([thunk])

describe('Component <ServiceList />', () => {
  const service1 = 'service1'
  const service2 = 'service1'

  it('should recieve props from store', () => {
    const state = {
      services: {
        active: service2,
        list: {
          [service1]: {
            name: service1,
            mounted: false
          },
          [service2]: {
            name: service2,
            mounted: true
          }
        }
      }
    }
    const store = createStore(state)
    const wrapper = enzyme.shallow(<ServiceList />, {
      context: { store }
    })
    expect(wrapper.props().list).to.deep.equal(state.services.list)
    expect(wrapper.props().active).to.equal(state.services.active)
  })
})
