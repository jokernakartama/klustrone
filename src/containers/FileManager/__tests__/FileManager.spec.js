import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import FileManager from '../FileManager'
import { RESOURCES_TRASH_FLAG_UPDATE } from '~/ducks/resourceIsTrash/resourceIsTrash'
import { SERVICE_SELECT } from '~/ducks/activeService/activeService'
import { RESOURCES_PATH_UPDATE } from '~/ducks/resourcePath/resourcePath'

const mockStore = configureStore([thunk])

function getTypes (actions) {
  return actions.map((action) => {
    return action.type
  })
}

describe('Component <FileManager />', () => {
  const active = 'cloud'
  const list = {
    cloud: {
      name: 'cloud',
      mounted: true
    }
  }
  const state = {
    services: {
      list,
      active
    }
  }
  let store

  beforeEach(() => {
    store = mockStore(state)
  })

  it('should recieve props from store', () => {
    const wrapper = enzyme.shallow(<FileManager />, {
      context: { store }
    })
    expect(wrapper.props().services).to.deep.equal(state.services.list)
  })

  it('should render presentational component', () => {
    const wrapper = enzyme.shallow(<FileManager />, {
      context: { store }
    })

    expect(wrapper.dive().name()).to.equal('FileManagerView')
  })

  it('should dispatch actions to set store state by url', () => {
    const wrapper = enzyme.mount(<FileManager />, {
      context: { store }
    })
    const dispatchedActionTypes = getTypes(store.getActions())
    expect(dispatchedActionTypes).to.have.members([SERVICE_SELECT, RESOURCES_PATH_UPDATE, RESOURCES_TRASH_FLAG_UPDATE])
  })
})
