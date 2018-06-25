import React from 'react'
import UIDialogConfirm from '../UIDialogConfirm'

describe('Component <UIDialogConfirm />', () => {
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<UIDialogConfirm />)
    expect(wrapper.name()).to.equal('UIDialogConfirmView')
  })
})
