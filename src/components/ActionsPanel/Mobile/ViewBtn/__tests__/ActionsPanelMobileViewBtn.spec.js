import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ActionsPanelMobileViewBtn from '../ActionsPanelMobileViewBtn'

const mockStore = configureStore([thunk])

describe('Component <ActionsPanelMobileViewBtn />', () => {
  const state = { view: 'list'}
  let store
  beforeEach(() => {
    store = mockStore(state)
  })
  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<ActionsPanelMobileViewBtn />, {
      context: { store }
    })
    expect(wrapper.props().view).to.equal(state.view)
  })
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<ActionsPanelMobileViewBtn />, {
      context: { store }
    })
    expect(wrapper.dive().name()).to.equal('ActionsPanelMobileViewBtnView')
  })
})
