import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ServicePanel from '../ServicePanel'

const mockStore = configureStore([thunk])

describe('Component <ServicePanel />', () => {
  const active = 'fake'
  const state = {
    services: {
      active: active,
      list: {
        [active]: {
          name: active,
          mounted: false
        }
      }
    }
  }
  let store
  beforeEach(() => {
    store = mockStore(state)
  })
  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<ServicePanel />, {
      context: { store }
    })
    expect(wrapper.props().active).to.equal(state.services.active)
    expect(wrapper.props().list).to.deep.equal(state.services.list)
  })
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<ServicePanel />, {
      context: { store }
    })
    expect(wrapper.dive().name()).to.equal('ServicePanelView')
  })
})
