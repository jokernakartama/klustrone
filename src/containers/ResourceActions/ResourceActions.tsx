import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as listActions from '~/ducks/resourceList'
import * as dirActions from '~/ducks/resourceDirectory'
import * as loadingActions from '~/ducks/loading'
import * as bufferActions from '~/ducks/resourceBuffer'

interface IResourceActionsContainerProps {
  children?: React.ReactNode
  list: IResourceListActionPayload
  path: string
  active: string
  selected: string|null
  buffer: object
  isTrash: boolean
  listActions: any
  loadingActions: any
  dirActions: any
  bufferActions: any
}

interface IResourceActionsContainerState {
  inProgress: boolean
}

class ResourceActions extends React.PureComponent<IResourceActionsContainerProps, IResourceActionsContainerState> {
  public inProgress = false

  constructor (props) {
    super(props)
    this.purge = this.purge.bind(this)
    this.update = this.update.bind(this)
    this.makeDir = this.makeDir.bind(this)
    this.paste = this.paste.bind(this)
    this.copy = this.copy.bind(this)
    this.cut = this.cut.bind(this)
    this.rename = this.rename.bind(this)
    this.publish = this.publish.bind(this)
    this.unpublish = this.unpublish.bind(this)
    this.remove = this.remove.bind(this)
    this.download = this.download.bind(this)
  }

  public render () {
    const { children, isTrash, selected, list, buffer, active } = this.props
    const info = selected !== null && list[selected] ? list[selected] : null
    const bufferData = active && buffer && buffer[active] ? buffer[active] : null
    const props = {
      isTrash,
      info,
      buffer: bufferData,
      update: this.update,
      makeDir: this.makeDir,
      purge: this.purge,
      paste: this.paste,
      copy: this.copy,
      cut: this.cut,
      rename: this.rename,
      publish: this.publish,
      unpublish: this.unpublish,
      remove: this.remove,
      download: this.download
    }
    const content = React.isValidElement(children) ? React.cloneElement(children, props) : children || null
    return content
  }
  private update (): void {
    const { loadingStart, loadingEnd } = this.props.loadingActions
    const { getMeta } = this.props.dirActions
    const { getList } = this.props.listActions
    loadingStart()
    Promise.all([
      getMeta(),
      getList()
    ])
      .then(() => {
        loadingEnd()
      })
  }
  private makeDir (name): void {
    const { makeDir } = this.props.listActions
    makeDir(name)
  }
  private purge () {
    const { purgeTrash } = this.props.listActions
    const { loadingStart, loadingEnd } = this.props.loadingActions
    loadingStart()
    purgeTrash()
      .then(() => {
        loadingEnd()
      })
  }

  private paste (): void {
    const { pasteResource } = this.props.listActions
    const { active, path, buffer } = this.props
    const copy = this.copy
    if (buffer[active]) {
      pasteResource(buffer[active].path, path, buffer[active].copy)
        .then(() => {
          // when resource has been moved it's path can be modified
          // so we should copy newly relocated resource to able to paste it further
          if (!buffer[active].copy) copy(buffer[active].id)
        })
    }
  }

  private copy (id?: string): void {
    const { copyResource } = this.props.bufferActions
    const { list, selected, active } = this.props
    if (list !== null && active) {
      if (id && list[id]) {
        // manually set resource to copy
        copyResource(id, list[id].path, active)
      } else if (selected !== null && list[selected]) {
        copyResource(list[selected].id, list[selected].path, active)
      }
    }
  }

  private cut (): void {
    const { cutResource } = this.props.bufferActions
    const { list, selected, active } = this.props
    if (list !== null && selected !== null && list[selected] && active) {
      cutResource(list[selected].id, list[selected].path, active)
    }
  }

  private rename (newName: string): void {
    const { renameResource } = this.props.listActions
    const { list, selected } = this.props
    if (list !== null && selected !== null && list[selected]) {
      renameResource(list[selected].path, newName)
    }
  }

  private publish (): void {
    const { publishResource } = this.props.listActions
    const { list, selected } = this.props
    if (list !== null && selected !== null && list[selected]) {
      publishResource(list[selected].path)
    }
  }
  private unpublish (): void {
    const { unpublishResource } = this.props.listActions
    const { list, selected } = this.props
    if (list !== null && selected !== null && list[selected]) {
      unpublishResource(list[selected].path)
    }
  }
  private remove (): void {
    const { removeResource } = this.props.listActions
    const { list, selected } = this.props
    if (list !== null && selected !== null && list[selected]) {
      removeResource(list[selected].path)
    }
  }

  private download (): void {
    const { downloadResource } = this.props.listActions
    const { list, selected } = this.props
    if (list !== null && selected !== null && list[selected]) {
      downloadResource(list[selected].path)
    }
  }
}

function mapStateToProps (state) {
  return {
    selected: state.resources.selected,
    isTrash: state.resources.isTrash,
    list: state.resources.list,
    buffer: state.buffer,
    active: state.services.active,
    path: state.resources.path,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    listActions: bindActionCreators(listActions, dispatch),
    dirActions: bindActionCreators(dirActions, dispatch),
    loadingActions: bindActionCreators(loadingActions, dispatch),
    bufferActions: bindActionCreators(bufferActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceActions)
