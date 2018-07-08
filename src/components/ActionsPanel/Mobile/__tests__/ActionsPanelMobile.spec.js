import React from 'react'
import ActionsPanelMobile from '../ActionsPanelMobile'

describe('Component <ActionsPanelMobile />', () => {
  const props = {
    isTrash: false,
    info: null,
    buffer: { fake: { id: null, path: null, copy: true } },
    update: sinon.spy(),
    makeDir: sinon.spy(),
    purge: sinon.spy(),
    paste: sinon.spy(),
    copy: sinon.spy(),
    cut: sinon.spy(),
    rename: sinon.spy(),
    publish: sinon.spy(),
    unpublish: sinon.spy(),
    remove: sinon.spy(),
    download: sinon.spy()
  }
  it('should render a presentational component', () => {
    const wrapper = enzyme.shallow(<ActionsPanelMobile {...props} />)
    expect(wrapper.name()).to.equal('ActionsPanelMobileView')
  })
})
