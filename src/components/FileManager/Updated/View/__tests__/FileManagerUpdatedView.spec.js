import React from 'react'
import FileManagerUpdatedView from '../FileManagerUpdatedView'

describe('Component <FileManagerUpdatedView />', () => {
  const actionSpy = sinon.spy()
  const wrapper = enzyme.shallow(<FileManagerUpdatedView action={ actionSpy }/>)
  it('should contain a button to make an action', () => {
    wrapper.find('.button').simulate('click')
    expect(wrapper.find('.button').exists()).to.be.true
    expect(actionSpy.called).to.be.true
  })
})
