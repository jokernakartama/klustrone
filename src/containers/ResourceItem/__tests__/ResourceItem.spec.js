import React from 'react'
import ResourceItem from '../ResourceItem'
import { history, APPLICATION_SERVER_DIRECTORY } from '~/utils/history'
import {
  RESOURCE_TYPE_DIR_NAME,
  RESOURCE_TYPE_ROOT_NAME,
  RESOURCE_TYPE_TRASH_NAME
} from '~/api'

describe('Component <ResourceItem />', () => {
  it('should render presentational component as an endpoint', () => {
    const wrapper = enzyme.shallow(<ResourceItem />)
    expect(wrapper.name()).to.equal('ResourceItemView')
  })
  describe('ResourceItem.onClickHandler', () => {
    it('should prevent default action on left click', () => {
      const wrapper = enzyme.shallow(<ResourceItem />)
      const fakeEvent = {
        button: 0,
        preventDefault: sinon.spy()
      }
      wrapper.instance().onClickHandler(fakeEvent)
      expect(fakeEvent.preventDefault.called).to.be.true
    })
  })
  describe('ResourceItem.onDoubleClickHandler', () => {
    let wrapper
    function setProps (props) {
      wrapper = enzyme.shallow(<ResourceItem { ...props } />)
    }

    it('should prevent opening directories when "isTrash" property is set to true', () => {
      const props = {
        type: RESOURCE_TYPE_DIR_NAME,
        isTrash: true,
        href: 'somepath'
      }
      setProps(props)
      wrapper.instance().onDoubleClickHandler()
      const expectedPathName = APPLICATION_SERVER_DIRECTORY + props.href
      expect(history.location.pathname).to.be.not.equal(expectedPathName)
    })
    it('should open a resource when the resource type is directory', () => {
      const props = {
        type: RESOURCE_TYPE_DIR_NAME,
        isTrash: false,
        href: 'anydirectory'
      }
      setProps(props)
      wrapper.instance().onDoubleClickHandler()
      const expectedPathName = APPLICATION_SERVER_DIRECTORY + props.href
      expect(history.location.pathname).to.be.equal(expectedPathName)
    })
    it('should open a resource when the resource type is trash', () => {
      const props = {
        type: RESOURCE_TYPE_TRASH_NAME,
        href: 'trashbin'
      }
      setProps(props)
      wrapper.instance().onDoubleClickHandler()
      const expectedPathName = APPLICATION_SERVER_DIRECTORY + props.href
      expect(history.location.pathname).to.be.equal(expectedPathName)
    })
    it('should open a resource when the resource type is root', () => {
      const props = {
        type: RESOURCE_TYPE_ROOT_NAME,
        href: 'parentdirectory'
      }
      setProps(props)
      wrapper.instance().onDoubleClickHandler()
      const expectedPathName = APPLICATION_SERVER_DIRECTORY + props.href
      expect(history.location.pathname).to.be.equal(expectedPathName)
    })
  })
})
