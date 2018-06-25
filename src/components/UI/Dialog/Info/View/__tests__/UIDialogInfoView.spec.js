import React from 'react'
import UIDialogInfoView from '../UIDialogInfoView'

describe('Component <UIDialogInfoView />', () => {
  it('should contain a button to make an action', () => {
    const acceptSpy = sinon.spy()
    const wrapper = enzyme.mount(<UIDialogInfoView accept={ acceptSpy } />)
    wrapper.find('button').at(0).simulate('click')
    expect(acceptSpy.called).to.be.true
  })
})
