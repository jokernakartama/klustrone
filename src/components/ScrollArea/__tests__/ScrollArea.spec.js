import React from 'react'
import ScrollArea from '../ScrollArea'

const ChildComponent = (props) => {
  return <div className='child-component'>Any content</div>
}

describe('Component <ScrollArea />', () => {
  it('should render child components', () => {
    const wrapper = enzyme.render(<ScrollArea><ChildComponent /></ScrollArea>)
    expect(wrapper.find('.child-component')).to.have.length(1)
  })
  it('should handle className property', () => {
    const className = 'custom'
    const wrapper = enzyme.shallow(<ScrollArea className={ className } />)
    expect(wrapper.dive().find('.' + className)).to.have.length(1)
  })
})
