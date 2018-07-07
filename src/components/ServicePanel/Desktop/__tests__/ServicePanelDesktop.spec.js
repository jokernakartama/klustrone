import React from 'react'
import ServicePanelDesktop from '../ServicePanelDesktop'

describe('Component <ServicePanelDesktop />', () => {
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
    const wrapper = enzyme.shallow(<ServicePanelDesktop { ...props } />)
    expect(wrapper.name()).to.equal('ServicePanelDesktopView')
  })
  it('should provide a function as a prop to select service options (and deselect others\' ones)', () => {
    const wrapper = enzyme.shallow(<ServicePanelDesktop { ...props } />)
    const prevState = wrapper.state().selected
    wrapper.props().pull(active)
    const nextState = wrapper.state().selected
    expect(nextState).to.not.equal(prevState)
    wrapper.props().pull(active)
    const lastState = wrapper.state().selected
    expect(prevState).to.equal(lastState)
  })
  it('should provide a function as a prop to change component\'s own state', () => {
    const wrapper = enzyme.shallow(<ServicePanelDesktop { ...props } />)
    const prevState = wrapper.state().visible
    wrapper.props().toggle()
    const nextState = wrapper.state().visible
    expect(nextState).to.not.equal(prevState)
  })
})