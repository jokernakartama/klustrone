import React from 'react'
import UIDialogConfirmView from '../UIDialogConfirmView'

describe('Component <UIDialogConfirmView />', () => {
  it('should contain buttons to make and cancel actions', () => {
    const acceptSpy = sinon.spy()
    const declineSpy = sinon.spy()
    const wrapper = enzyme.mount(<UIDialogConfirmView accept={ acceptSpy } decline={ declineSpy } />)
    wrapper.find('button').at(0).simulate('click')
    wrapper.find('button').at(1).simulate('click')
    expect(acceptSpy.called).to.be.true
    expect(declineSpy.called).to.be.true
  })
})
