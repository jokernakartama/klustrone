import React from 'react'
import UIDialogView from '../UIDialogView'

describe('Component <UIDialogView />', () => {
  it('should call close() if "esc" button has been pushed', () => {
    const payload = { type: 'info' }
    const closeSpy = sinon.spy()
    const wrapper = enzyme.mount(<UIDialogView payload={ payload } close={ closeSpy } />)
    window.document.dispatchEvent(new KeyboardEvent('keyup',{ keyCode: 27 }))
    expect(closeSpy.called).to.be.true
  })
})
