import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ActionsPanelMobileSortBtn from '../ActionsPanelMobileSortBtn'

const mockStore = configureStore([thunk])

describe('Component <ActionsPanelMobileSortBtn />', () => {
  const state = {
    sort: {
      asc: true,
      field: 'size'
    }
  }
  let store
  beforeEach(() => {
    store = mockStore(state)
  })
  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<ActionsPanelMobileSortBtn />, {
      context: { store }
    })
    expect(wrapper.props().asc).to.equal(state.sort.asc)
    expect(wrapper.props().field).to.equal(state.sort.field)
  })
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<ActionsPanelMobileSortBtn />, {
      context: { store }
    })
    expect(wrapper.dive().name()).to.equal('ActionsPanelMobileSortBtnView')
  })
})
