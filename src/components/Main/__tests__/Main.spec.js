import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import Main from '../Main'

const mockStore = configureStore([thunk])

describe('Component <Main />', () => {
  const state = { loading: false }

  it('should recieve props from store', () => {
    const store = mockStore(state)
    const wrapper = enzyme.shallow(<Main />, {
      context:  { store }
    })
    expect(wrapper.props().loading).to.equal(state.loading)
  })
})
  