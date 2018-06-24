import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loc } from '~/constants'
import * as resourceSelectedActions from '~/ducks/resourceSelected'
import {
  createHref,
  serviceMap,
  sortList,
  RESOURCE_TYPE_ROOT_NAME,
  RESOURCE_TYPE_TRASH_NAME
} from '~/api'
import ResourceListItem from './Item'
import ResourceListView from './View'

class ResourceList extends React.PureComponent<IResourceListComponent.Props> {
  public render () {
    const { sort, resources, selected, view, directory, isTrash, serviceName } = this.props
    const { select } = this.props.resourceSelectedActions
    let resList = null
    let parentLink = null
    let trashLink = null
    if (resources !== null && directory !== null) {
      if (!directory.isRoot || isTrash) {
        const parent = isTrash ? '' : directory.parent
        parentLink = (
          <ResourceListItem
            name={ loc.RESOURCE_LABEL_PARENT }
            key={ RESOURCE_TYPE_ROOT_NAME }
            view={ view }
            path={ parent }
            href={ createHref(parent, serviceName, RESOURCE_TYPE_ROOT_NAME, false) }
            type={ RESOURCE_TYPE_ROOT_NAME }
          />
        )
      }
      if (!isTrash && directory.isRoot && !serviceMap[serviceName].settings.trashBinIsUnsupported) {
        trashLink = (
          <ResourceListItem
            name={ loc.RESOURCE_LABEL_TRASH }
            key={ RESOURCE_TYPE_TRASH_NAME }
            view={ view }
            path='trash'
            href={ createHref('', serviceName, RESOURCE_TYPE_TRASH_NAME, true) }
            type={ RESOURCE_TYPE_TRASH_NAME }
          />
        )
      }
      resList = sortList(resources, sort.field, sort.asc).map((id, index) => {
        const $select = () => select(id)
        return (
          <ResourceListItem
            id={ id }
            isTrash={ isTrash }
            key={ index }
            view={ view }
            name={ resources[id].name }
            path={ resources[id].path }
            href={ createHref(resources[id].path, serviceName, resources[id].type, isTrash) }
            isPublic={ resources[id].publicLink === null ? false : true }
            isSelected={ id === selected }
            preview={ (resources[id].type === 'picture' || resources[id].type === 'image') ? resources[id].preview : null }
            select={ $select }
            type={ resources[id].type }
          />
        )
      })
    }
    return (
      <ResourceListView view={ view }>
        { parentLink }
        { resList }
        { trashLink }
      </ResourceListView>
    )
  }
}

function mapStateToProps (state) {
  return {
    serviceName: state.services.active,
    path: state.resources.path,
    isTrash: state.resources.isTrash,
    resources: state.resources.list,
    directory: state.resources.dir,
    sort: state.sort,
    selected: state.resources.selected,
    view: state.view
  }
}

function mapDispatchToProps (dispatch) {
  return {
    resourceSelectedActions: bindActionCreators(resourceSelectedActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceList)
