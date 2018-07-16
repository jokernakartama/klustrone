import React from 'react'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import StaticPage from '../StaticPage'

const mockStore = configureStore([thunk])

describe('Component <StaticPage />', () => {
  let store
  beforeEach(() => {
    store = mockStore({ loading: false })
  })
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<StaticPage pageName='any' />, {
      context: {
        store
      }
    })
    expect(wrapper.dive().name()).to.equal('StaticPageView')
  })
})
