import React from 'react'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import DirectoryActions from '../DirectoryActions'

const createStore = configureStore([thunk])

describe('Component <DirectoryActions />', () => {
  const state = {
    resources: {
      isTrash: false
    }
  }
  let store
  beforeEach(() => {
    store = createStore(state)
  })
  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<DirectoryActions />, {
      context: { store }
    })
    expect(wrapper.props().isTrash).to.equal(state.resources.isTrash)
  })
  it('should pass props to a child component', () => {
    const ChildComponent = (props) => {
      return null
    }
    const wrapper = enzyme.shallow(<DirectoryActions><ChildComponent /></DirectoryActions>, {
      context: { store }
    })
    const expectedProps = [
      'isTrash',
      'update',
      'makeDir',
      'purge'
    ]
    const child = wrapper.dive()
    expect(child.props()).to.include.keys(...expectedProps)
  })
})
