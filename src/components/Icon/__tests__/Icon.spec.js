import React from 'react'
import Icon from '../Icon'

describe('Component <Icon />', () => {
  it('should be rendered with proper class names', () => {
    const wrapper = enzyme.render(<Icon icon='larr' className='content__icon' />)
    expect(wrapper.hasClass('icon_larr')).to.equal(true)
    expect(wrapper.hasClass('content__icon')).to.equal(true)
  })
  it('should render children components', function () {
    const someText = 'some text'
    const wrapper = enzyme.render(<Icon icon='screen'>{ someText }</Icon>)
    expect(wrapper.text()).to.equal(someText)
  })
})
