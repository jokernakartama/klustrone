import React from 'react'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import ViewActions from '../ViewActions'

const createStore = configureStore([thunk])

describe('Component <ViewActions />', () => {
  const state = {
    view: 'list'
  }
  let store
  beforeEach(() => {
    store = createStore(state)
  })
  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<ViewActions />, {
      context: { store }
    })
    expect(wrapper.props().view).to.equal(state.view)
  })
  it('should pass props to a child component', () => {
    const ChildComponent = (props) => {
      return null
    }
    const wrapper = enzyme.shallow(<ViewActions><ChildComponent /></ViewActions>, {
      context: { store }
    })
    const expectedProps = [
      'view',
      'change'
    ]
    const child = wrapper.dive()
    expect(child.props()).to.include.keys(...expectedProps)
  })
})
