import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ResourceList from '../ResourceList'
import { getFakeList, getFakeResource } from '~/api/FakeCloudAPI'

const mockStore = configureStore([thunk])

describe('Component <ResourceList />', () => {
  const state = {
    active: {
      service: 'fake',
      path: '/',
      isTrash: false
    },
    resources: {
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
    expect(wrapper.props().service).to.equal(state.active.service)
    expect(wrapper.props().path).to.equal(state.active.path)
    expect(wrapper.props().view).to.equal(state.view)
    expect(wrapper.props().sort).to.deep.equal(state.sort)
    expect(wrapper.props().resources).to.deep.equal(state.resources.list)
    expect(wrapper.props().directory).to.deep.equal(state.resources.dir)
    expect(wrapper.props().isTrash).to.equal(state.active.isTrash)
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
