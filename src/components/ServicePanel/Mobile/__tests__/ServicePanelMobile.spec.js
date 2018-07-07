import React from 'react'
import ServicePanelMobile from '../ServicePanelMobile'

describe('Component <ServicePanelMobile />', () => {
  const active = 'fake'
  const list = {
    [active]: {
      name: active,
      mounted: true
    }
  }
  const unmount = sinon.spy()
  const mount = sinon.spy()
  const props = {
    active,
    list,
    unmount,
    mount
  }
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<ServicePanelMobile { ...props } />)
    expect(wrapper.name()).to.equal('ServicePanelMobileView')
  })
})
