import React from 'react'
import ResourceListItemView from '../ResourceListItemView'
import {
  RESOURCE_TYPE_DIR_NAME,
  RESOURCE_TYPE_ROOT_NAME,
  RESOURCE_TYPE_TRASH_NAME
} from '~/api'

describe('Component <ResourceListItemView />', () => {
  it('should render an <a /> tag for directories', () => {
    const linkTypes = [
      RESOURCE_TYPE_DIR_NAME,
      RESOURCE_TYPE_ROOT_NAME,
      RESOURCE_TYPE_TRASH_NAME
    ]
    linkTypes.forEach((type) => {
      const props = {
        view: 'tile',
        path: '',
        type
      }
      const wrapper = enzyme.shallow(<ResourceListItemView { ...props } />)
      expect(wrapper.is('a')).to.be.true
    })
  })
  it('should not render an <a /> tag for files', () => {
    const props = {
      view: 'tile',
      path: ''
    }
    const wrapper = enzyme.shallow(<ResourceListItemView { ...props } />)
    expect(wrapper.is('a')).to.be.false
  })
})
