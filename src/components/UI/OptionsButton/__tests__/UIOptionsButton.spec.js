import React from 'react'
import UIOptionsButton from '../UIOptionsButton'

const ChildComponent = () => <i className="child">A child</i>

describe('Component <UIOptionsButton />', () => {
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<UIOptionsButton />)
    expect(wrapper.name()).to.equal('UIOptionsButtonView')
  })
  it('should render child components', () => {
    const wrapper = enzyme.shallow(<UIOptionsButton><ChildComponent /></UIOptionsButton>)
    expect(wrapper.exists(ChildComponent)).to.be.true
  })
  it('should provide methods as props to change it\'s own state', () => {
    const wrapper = enzyme.shallow(<UIOptionsButton />)
    wrapper.setState({ visible: false })
    wrapper.props().toggle()
    expect(wrapper.state().visible).to.be.true
    wrapper.props().hide()
    expect(wrapper.state().visible).to.be.false
  })
})
