import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ResourceList from '../ResourceList'
import { getFakeList, getFakeResource } from '~/api/FakeCloudAPI'

const mockStore = configureStore([thunk])

describe('Component <ResourceList />', () => {
  const state = {
    services: {
      active: 'fake',
    },
    resources: {
      path: '/',
      isTrash: false,
      dir: getFakeResource(true),
      list: getFakeList()
    },
    sort: {
      field: 'size',
      asc: true
    },
    view: 'list'
  }
  const store = mockStore(state)
  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<ResourceList />, {
      context: { store }
    })
    expect(wrapper.props().serviceName).to.equal(state.services.active)
    expect(wrapper.props().path).to.equal(state.resources.path)
    expect(wrapper.props().view).to.equal(state.view)
    expect(wrapper.props().sort).to.deep.equal(state.sort)
    expect(wrapper.props().resources).to.deep.equal(state.resources.list)
    expect(wrapper.props().directory).to.deep.equal(state.resources.dir)
    expect(wrapper.props().isTrash).to.equal(state.resources.isTrash)
  })
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<ResourceList />, {
      context: { store }
    })
    expect(wrapper.dive().name()).to.equal('ResourceListView')
  })
  it('should provide props to a presentational component', () => {
    const wrapper = enzyme.shallow(<ResourceList />, {
      context: { store }
    })
    expect(wrapper.dive().props().view).to.equal(wrapper.props().view)
  })
})
