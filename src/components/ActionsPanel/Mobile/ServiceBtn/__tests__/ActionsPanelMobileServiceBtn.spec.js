import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ActionsPanelMobileServiceBtn from '../ActionsPanelMobileServiceBtn'

const mockStore = configureStore([thunk])

describe('Component <ActionsPanelMobileServiceBtn />', () => {
  const state = {
    services: { fake: { name: 'fake', mounted: false } },
    active: {
      service: 'fake'
    }
  }
  let store
  beforeEach(() => {
    store = mockStore(state)
  })
  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<ActionsPanelMobileServiceBtn />, {
      context: { store }
    })
    expect(wrapper.props().list).to.deep.equal(state.services)
    expect(wrapper.props().service).to.equal(state.active.service)
  })
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<ActionsPanelMobileServiceBtn />, {
      context: { store }
    })
    expect(wrapper.dive().name()).to.equal('ActionsPanelMobileServiceBtnView')
  })
})
