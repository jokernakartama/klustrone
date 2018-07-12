import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ResourceInfo from '../ResourceInfo'
import { getFakeList, getFakeResource } from '~/api/FakeCloudAPI'

const mockStore = configureStore([thunk])

describe('Component <ResourceInfo />', () => {
  const list = getFakeList()
  const state = {
    loading: false,
    resources: {
      list: getFakeList(),
      dir: getFakeResource(true)
    },
    active: { isTrash: false }
  }
  state.resources.selected = Object.keys(list)[0]
  let store
  beforeEach(() => {
    store = mockStore(state)
  })
  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<ResourceInfo />, {
      context: { store }
    })
    expect(wrapper.props().loading).to.equal(state.loading)
    expect(wrapper.props().dir).to.deep.equal(state.resources.dir)
    expect(wrapper.props().list).to.deep.equal(state.resources.list)
    expect(wrapper.props().selected).to.equal(state.resources.selected)
    expect(wrapper.props().isTrash).to.equal(state.active.isTrash)
  })
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<ResourceInfo />, {
      context: { store }
    })
    expect(wrapper.dive().name()).to.equal('ResourceInfoView')
  })
})
