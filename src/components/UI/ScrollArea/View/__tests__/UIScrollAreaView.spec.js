import React from 'react'
import UIScrollAreaView from '../UIScrollAreaView'

const ChildComponent = (props) => {
  return <div className='child-component'>Any content</div>
}

describe.only('Component <UIScrollAreaView />', () => {
  it('should render child components', () => {
    const wrapper = enzyme.shallow(<UIScrollAreaView><ChildComponent /></UIScrollAreaView>)
    expect(wrapper.exists(ChildComponent)).to.be.true
  })
  it('should handle className property', () => {
    const className = 'custom'
    const wrapper = enzyme.shallow(<UIScrollAreaView className={ className } />)
    expect(wrapper.dive().find('.' + className)).to.have.length(1)
  })
})
