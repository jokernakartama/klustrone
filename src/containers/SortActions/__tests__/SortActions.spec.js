import React from 'react'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import SortActions from '../SortActions'

const createStore = configureStore([thunk])

describe('Component <SortActions />', () => {
  const state = {
    sort: {
      field: 'name',
      asc: true
    }
  }
  let store
  beforeEach(() => {
    store = createStore(state)
  })
  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<SortActions />, {
      context: { store }
    })
    expect(wrapper.props().asc).to.equal(state.sort.asc)
    expect(wrapper.props().field).to.equal(state.sort.field)
  })
  it('should pass props to a child component', () => {
    const ChildComponent = (props) => {
      return null
    }
    const wrapper = enzyme.shallow(<SortActions><ChildComponent /></SortActions>, {
      context: { store }
    })
    const expectedProps = [
      'field',
      'asc',
      'toggleDirection',
      'changeSort'
    ]
    const child = wrapper.dive()
    expect(child.props()).to.include.keys(...expectedProps)
  })
})
