import React from 'react'
import UIIconView from '../UIIconView'

describe('Component <UIIconView />', () => {
  it('should be rendered with proper class names', () => {
    const wrapper = enzyme.render(<UIIconView icon='larr' className='content__UIiconView' />)
    expect(wrapper.hasClass('UIiconView_larr')).to.equal(true)
    expect(wrapper.hasClass('content__UIiconView')).to.equal(true)
  })
  it('should render children components', function () {
    const someText = 'some text'
    const wrapper = enzyme.render(<UIIconView icon='screen'>{ someText }</UIIconView>)
    expect(wrapper.text()).to.equal(someText)
  })
})
