import React from 'react'
import FileManagerView from '../FileManagerView'
import { renderStatus } from '../FileManagerView'

const ChildComponent = (props) => {
  return <div className='child-component'>Any content</div>
}

describe('Component <FileManagerView />', () => {
  it('should render components depending on status', () => {
    const wrapper = enzyme.shallow(<FileManagerView serviceStatus={ renderStatus.MOUNTED }/>)
    expect(wrapper.find('.file-manager').exists()).to.equal(true)
    wrapper.setProps({ serviceStatus: renderStatus.UNMOUNTED })
    expect(wrapper.name()).to.be.equal('FileManagerUnmountedView')
    wrapper.setProps({ serviceStatus: renderStatus.UPDATED })
    expect(wrapper.name()).to.be.equal('FileManagerUpdatedView')
    wrapper.setProps({ serviceStatus: renderStatus.UNAVAILABLE })
    expect(wrapper.name()).to.be.equal('NotFound')
  })
  it('should render children if service status is MOUNTED', () => {
    const wrapper = enzyme.shallow(
      <FileManagerView serviceStatus={ renderStatus.MOUNTED }>
        <ChildComponent />
      </FileManagerView>
    )
    expect(wrapper.contains(<ChildComponent />)).to.be.true
  })
})
