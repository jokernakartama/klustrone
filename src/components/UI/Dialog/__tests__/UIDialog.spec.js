import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import UIDialog from '../UIDialog'
import { history } from '~/utils/history'

const mockStore = configureStore([thunk])

describe('Component <UIDialog />', () => {
  const state = {
    modal: {
      type: 'info'
    }
  }
  it('should recieve props from store', () => {
    const store = mockStore(state)
    const wrapper = enzyme.shallow(<UIDialog />, {
      context: { store }
    })
    expect(wrapper.props().data).to.deep.equal(state.modal)
  })
  it('should render a presentational component', () => {
    const store = mockStore(state)
    const wrapper = enzyme.shallow(<UIDialog />, {
      context: { store }
    })
    expect(wrapper.dive().name()).to.equal('UIDialogView')
  })
})
