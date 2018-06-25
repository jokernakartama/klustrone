import React from 'react'
import UIDialogInfo from '../UIDialogInfo'

describe('Component <UIDialogInfo />', () => {
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<UIDialogInfo />)
    expect(wrapper.name()).to.equal('UIDialogInfoView')
  })
})
