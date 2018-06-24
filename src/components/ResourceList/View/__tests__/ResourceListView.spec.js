import React from 'react'
import ResourceListView from '../ResourceListView'

const ChildComponent = (props) => {
  return <div className='child-component'>Any content</div>
}

describe('Component <ResourceListView />', () => {
  it('should render child components', () => {
    const wrapper = enzyme.render(<ResourceListView><ChildComponent /></ResourceListView >)
    expect(wrapper.find('.child-component')).to.have.length(1)
  })
})
