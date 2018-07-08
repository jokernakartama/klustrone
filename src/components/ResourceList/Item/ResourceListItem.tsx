import React from 'react'
import ResourceListItemView from './View'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as resourceSelectedActions from '~/ducks/resourceSelected'
import { history } from '~/utils/history'
import {
  RESOURCE_TYPE_DIR_NAME,
  RESOURCE_TYPE_ROOT_NAME,
  RESOURCE_TYPE_TRASH_NAME
} from '~/api'

class ResourceListItem extends React.PureComponent<IResourceListItemComponent.Props> {
  constructor (props) {
    super(props)
    this.onClickHandler = this.onClickHandler.bind(this)
    this.onDoubleClickHandler = this.onDoubleClickHandler.bind(this)
    this.onDragStartHandler = this.onDragStartHandler.bind(this)
  }

  public render () {
    const { id, href, type, view, path, name, isTrash, isPublic, size, selected } = this.props
    const isSelected = id === selected
    return (
      <ResourceListItemView
        id={ id }
        href={ href }
        view={ view }
        name={ name }
        path={ path }
        type={ type }
        size={ size }
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
    const { id } = this.props
    const { select } = this.props.resourceSelectedActions
    // keep ability to open link in new tab by middle click
    if (e.button === 0) e.preventDefault()
    if (id) select(id)
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

function mapStateToProps (state) {
  return {
    selected: state.resources.selected
  }
}

function mapDispatchToProps (dispatch) {
  return {
    resourceSelectedActions: bindActionCreators(resourceSelectedActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceListItem)
