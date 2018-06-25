import React from 'react'
import UIOptionsButtonView from '../UIOptionsButtonView'

const ChildComponent = () => <i>A child</i>

describe('Component <UIOptionsButtonView />', () => {
  it('should contain child components', () => {
    const wrapper = enzyme.shallow(<UIOptionsButtonView><ChildComponent /></UIOptionsButtonView>)
    expect(wrapper.contains(<ChildComponent />)).to.be.true
  })
})
