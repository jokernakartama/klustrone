import React from 'react'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import ResourceActions from '../ResourceActions'
import { getFakeResource, getFakeList } from '~/api/FakeCloudAPI'

const createStore = configureStore([thunk])

describe('Component <ResourceActions />', () => {
  const resource = getFakeResource()
  const state = {
    services: {
      active: 'fake'
    },
    resources: {
      list: getFakeList(resource),
      selected: resource.id,
      buffer: {
        'fake': {
          id: null,
          path: null,
          copy: true
        }
      },
      path: ''
    }
  }
  let store
  beforeEach(() => {
    store = createStore(state)
  })
  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<ResourceActions />, {
      context: { store }
    })
    expect(wrapper.props().selected).to.deep.equal(state.resources.selected)
    expect(wrapper.props().list).to.deep.equal(state.resources.list)
    expect(wrapper.props().buffer).to.deep.equal(state.buffer)
    expect(wrapper.props().active).to.deep.equal(state.services.active)
    expect(wrapper.props().path).to.deep.equal(state.resources.path)
  })
  it('should pass props to a child component', () => {
    const ChildComponent = (props) => {
      return null
    }
    const wrapper = enzyme.shallow(<ResourceActions><ChildComponent /></ResourceActions>, {
      context: { store }
    })
    const expectedProps = [
      'isTrash',
      'info',
      'buffer',
      'update',
      'makeDir',
      'purge',
      'paste',
      'copy',
      'cut',
      'rename',
      'publish',
      'unpublish',
      'remove',
      'download',
    ]
    const child = wrapper.dive()
    expect(child.props()).to.include.keys(...expectedProps)
  })
})
