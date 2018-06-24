import React from 'react'
import FileManagerView from '../FileManagerView'

const ChildComponent = (props) => {
  return <div className='child-component'>Any content</div>
}

describe('Component <FileManagerView />', () => {
  it('should render children if service status is MOUNTED', () => {
    const wrapper = enzyme.shallow(
      <FileManagerView>
        <ChildComponent />
      </FileManagerView>
    )
    expect(wrapper.contains(<ChildComponent />)).to.be.true
  })
})
