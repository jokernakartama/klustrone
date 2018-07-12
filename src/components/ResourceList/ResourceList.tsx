import React from 'react'
import { connect } from 'react-redux'
import { loc } from '~/constants'
import {
  createHref,
  serviceMap,
  sortList,
  RESOURCE_TYPE_ROOT_NAME,
  RESOURCE_TYPE_TRASH_NAME
} from '~/api'
import ResourceListItem from './Item'
import ResourceListView from './View'

class ResourceList extends React.Component<IResourceListComponent.Props> {
  public shouldComponentUpdate (nextProps: IResourceListComponent.Props) {
    const nextDir = nextProps.directory
    const nextList = nextProps.resources
    const nextService = nextProps.service
    const prevService = this.props.service
    const nextIsTrash = nextProps.isTrash
    const prevIsTrash = this.props.isTrash
    // When a directory updates
    // path or service changes immediately unlike the directory resource list
    // therefore system resource labels like "parent dir" and "trash"
    // can be displayed before other directory content, what looks wierd.
    // This condition makes the content to be rendered after resource list was fully loaded
    if (nextService === prevService && (nextDir === null || nextList === null || nextIsTrash !== prevIsTrash)) {
      return false
    } else {
      return true
    }
  }
  public render () {
    const { sort, resources, view, directory, isTrash, service } = this.props
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
            href={ createHref(parent, service, RESOURCE_TYPE_ROOT_NAME, false) }
            type={ RESOURCE_TYPE_ROOT_NAME }
          />
        )
      }
      if (!isTrash && directory.isRoot && !serviceMap[service].settings.trashBinIsUnsupported) {
        trashLink = (
          <ResourceListItem
            name={ loc.RESOURCE_LABEL_TRASH }
            key={ RESOURCE_TYPE_TRASH_NAME }
            view={ view }
            path='trash'
            href={ createHref('', service, RESOURCE_TYPE_TRASH_NAME, true) }
            type={ RESOURCE_TYPE_TRASH_NAME }
          />
        )
      }
      resList = sortList(resources, sort.field, sort.asc).map((id, index) => {
        return (
          <ResourceListItem
            id={ id }
            isTrash={ isTrash }
            key={ index }
            view={ view }
            name={ resources[id].name }
            path={ resources[id].path }
            size={ resources[id].size }
            href={ createHref(resources[id].path, service, resources[id].type, isTrash) }
            isPublic={ resources[id].publicLink === null ? false : true }
            preview={ (resources[id].type === 'picture' || resources[id].type === 'image') ? resources[id].preview : null }
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
    service: state.active.service,
    path: state.active.path,
    isTrash: state.active.isTrash,
    resources: state.resources.list,
    directory: state.resources.dir,
    sort: state.sort,
    view: state.view
  }
}

export default connect(mapStateToProps)(ResourceList)
