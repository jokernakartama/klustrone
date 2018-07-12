import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import FileManager from '../FileManager'

const mockStore = configureStore([thunk])

describe('Component <FileManager />', () => {
  const active = 'cloud'
  const list = {
    [active]: {
      name: active,
      mounted: true
    }
  }
  const state = {
    services: list,
    active: { service: active },
    resources: {
      path: '/',
      isTrash: false
    }
  }

  it('should recieve props from store', () => {
    const store = mockStore(state)
    const wrapper = enzyme.shallow(<FileManager />, {
      context: { store }
    })
    expect(wrapper.props().services).to.deep.equal(state.services)
  })

  it('should render a presentational component if service was mounted initially', () => {
    const store = mockStore(state)
    const wrapper = enzyme.shallow(<FileManager />, {
      context: { store }
    })
    expect(wrapper.dive().name()).to.equal('FileManagerView')
  })
})
