import React from 'react'
import UIDialogPrompt from '../UIDialogPrompt'

describe('Component <UIDialogPrompt />', () => {
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<UIDialogPrompt />)
    expect(wrapper.name()).to.equal('UIDialogPromptView')
  })
  it('should change state when input value changes', () => {
    const closeSpy = sinon.spy()
    const expectedText = 'You\'ve met with a terrible fate, haven\'t you?'
    const wrapper = enzyme.mount(<UIDialogPrompt close={ closeSpy } />)
    wrapper.setState({ data: '' })
    const prevState = wrapper.state()
    wrapper.find('input').at(0).simulate('change', { target: { value: expectedText } })
    const nextState = wrapper.state()
    expect(prevState.data).to.not.equal(nextState.data)
    expect(nextState.data).to.equal(expectedText)
  })
  it('should close the dialog and set the state when an "enter" key has been pushed', () => {
    const closeSpy = sinon.spy()
    const findId = 'unexpectable_id'
    const expectedText = 'Dodongo dislikes smoke'
    const wrapper = enzyme.mount(<UIDialogPrompt close={ closeSpy } />)
    const input = wrapper.find('input').at(0)
    input.simulate('change', { target: { value: expectedText } })
    input.getDOMNode().setSelectionRange(expectedText.length, expectedText.length)
    input.simulate('keypress', { charCode: 13 })
    expect(closeSpy.args[0]).to.include.members([ expectedText ])
  })
})
