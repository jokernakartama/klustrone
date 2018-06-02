import React from 'react'
import ResourceItemView from '~/components/ResourceItemView/'
import { history } from '~/utils/history'
import {
  RESOURCE_TYPE_DIR_NAME,
  RESOURCE_TYPE_ROOT_NAME,
  RESOURCE_TYPE_TRASH_NAME
} from '~/api'

interface IResourceItemContainerProps {
  id?: string
  href?: string
  name?: string
  path: string
  view: any
  preview?: string|null
  type?: string
  isSelected?: boolean
  isPublic?: boolean
  isTrash?: boolean
  select?: () => void
}

class ResourceItem extends React.PureComponent<IResourceItemContainerProps> {
  constructor (props) {
    super(props)
    this.onClickHandler = this.onClickHandler.bind(this)
    this.onDoubleClickHandler = this.onDoubleClickHandler.bind(this)
    this.onDragStartHandler = this.onDragStartHandler.bind(this)
  }

  public render () {
    const { id, href, type, view, path, name, isSelected, isTrash, isPublic } = this.props
    return (
      <ResourceItemView
        id={ id }
        href={ href }
        view={ view }
        name={ name }
        path={ path }
        type={ type }
        isSelected={ isSelected }
        isTrash={ isTrash }
        isPublic={ isPublic }
        onClickHandler={ this.onClickHandler }
        onDoubleClickHandler={ this.onDoubleClickHandler }
        onDragStartHandler={ this.onDragStartHandler }
      />
    )
  }
  private onClickHandler (e) {
    // keep ability to open link in new tab by middle click
    if (e.button === 0) e.preventDefault()
    if (this.props.select) this.props.select()
  }
  private onDoubleClickHandler () {
    const { type, isTrash, href } = this.props
    if ((type === RESOURCE_TYPE_DIR_NAME && !isTrash) || type === RESOURCE_TYPE_ROOT_NAME || type === RESOURCE_TYPE_TRASH_NAME) {
      history.push(href, { path: href })
    }
  }

  private onDragStartHandler (e) {
    e.preventDefault()
  }
}

export default ResourceItem
