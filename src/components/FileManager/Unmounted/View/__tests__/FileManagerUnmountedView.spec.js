import React from 'react'
import FileManagerUnmountedView from '../FileManagerUnmountedView'

describe('Component <FileManagerUnmountedView />', () => {
  const actionSpy = sinon.spy()
  const wrapper = enzyme.shallow(<FileManagerUnmountedView action={ actionSpy }/>)
  it('should contain a button to make an action', () => {
    wrapper.find('button.button').simulate('click')
    expect(wrapper.find('button.button').exists()).to.be.true
    expect(actionSpy.called).to.be.true
  })
})

