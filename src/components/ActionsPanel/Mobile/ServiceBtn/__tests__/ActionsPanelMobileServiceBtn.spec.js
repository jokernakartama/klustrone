import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ActionsPanelMobileServiceBtn from '../ActionsPanelMobileServiceBtn'

const mockStore = configureStore([thunk])

describe('Component <ActionsPanelMobileServiceBtn />', () => {
  const state = {
    services: {
      list: { fake: { name: 'fake', mounted: false } },
      active: 'fake'
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
    expect(wrapper.props().list).to.deep.equal(state.services.list)
    expect(wrapper.props().active).to.equal(state.services.active)
  })
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<ActionsPanelMobileServiceBtn />, {
      context: { store }
    })
    expect(wrapper.dive().name()).to.equal('ActionsPanelMobileServiceBtnView')
  })
})
