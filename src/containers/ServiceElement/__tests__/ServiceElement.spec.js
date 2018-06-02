import React from 'react'
import ServiceElement from '../ServiceElement'

describe('Component <ServiceElement />', () => {
  it('should manage service connection on componentDidUpdate', () => {
    const connectSpy = sinon.spy()
    const disconnectSpy = sinon.spy()
    const props = {
      isMounted: true,
      connect: connectSpy,
      disconnect: disconnectSpy,
    }
    const wrapper = enzyme.shallow(<ServiceElement {...props} />, { lifecycleExperimental: true })
    wrapper.setProps({ isMounted: false })
    expect(disconnectSpy.called).to.be.true
    wrapper.setProps({ isMounted: true })
    expect(connectSpy.called).to.be.true
  })
  it('should render presentational component as an endpoint', () => {
    const wrapper = enzyme.shallow(<ServiceElement />)
    expect(wrapper.name()).to.equal('ServiceElementView')
  })
})
