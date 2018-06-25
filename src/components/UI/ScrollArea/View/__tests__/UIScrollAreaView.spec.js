import React from 'react'
import UIScrollAreaView from '../UIScrollAreaView'

const ChildComponent = (props) => {
  return <div className='child-component' style={ { height: '300px' } }>Any content</div>
}

describe('Component <UIScrollAreaView />', () => {
  it('should render child components', () => {
    const wrapper = enzyme.shallow(<UIScrollAreaView><ChildComponent /></UIScrollAreaView>)
    expect(wrapper.exists(ChildComponent)).to.be.true
  })
  it('should handle className property', () => {
    const className = 'custom'
    const wrapper = enzyme.render(<UIScrollAreaView className={ className }><ChildComponent /></UIScrollAreaView>)
    expect(wrapper.find('.' + className)).to.have.length(1)
  })
})
