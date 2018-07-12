import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ActionsPanel from '../ActionsPanel'
import { getFakeList } from '~/api/FakeCloudAPI'

const mockStore = configureStore([thunk])

describe('Component <ActionsPanel />', () => {
  const selected = null
  const list = getFakeList()
  const path = ''
  const buffer = {
    fake: {
      id: null,
      path: null,
      copy: true
    }
  }
  const service = 'fake'
  const isTrash = false
  const state = {
    resources: {
      selected,
      list
    },
    buffer,
    active: { service, path, isTrash }
  }
  let store
  beforeEach(() => {
    store = mockStore(state)
  })
  it('should recieve props from state', () => {
    const wrapper = enzyme.shallow(<ActionsPanel />, {
      context: { store }
    })
    expect(wrapper.props().selected).to.equal(state.resources.selected)
    expect(wrapper.props().isTrash).to.equal(state.active.isTrash)
    expect(wrapper.props().list).to.deep.equal(state.resources.list)
    expect(wrapper.props().buffer).to.deep.equal(state.buffer)
    expect(wrapper.props().service).to.equal(state.active.service)
    expect(wrapper.props().path).to.equal(state.active.path)
  })
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<ActionsPanel />, {
      context: { store }
    })
    expect(wrapper.dive().name()).to.equal('ActionsPanelView')
  })
})
