import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as listActions from '~/ducks/resourceList'
import * as resourceSelectedActions from '~/ducks/resourceSelected'
import * as dirActions from '~/ducks/resourceDirectory'
import * as loadingActions from '~/ducks/loading'
import * as bufferActions from '~/ducks/resourceBuffer'
import ActionsPanelView from './View'

class ActionsPanel extends React.PureComponent<IActionsPanelComponent.Props> {
  constructor (props) {
    super(props)
    this.purge = this.purge.bind(this)
    this.restore = this.restore.bind(this)
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
    const { isTrash, selected, list, buffer, service } = this.props
    const info = selected !== null && list !== null && list[selected] ? list[selected] : null
    const bufferData = service && buffer && buffer[service] ? buffer[service] : null
    const props = {
      isTrash,
      info,
      buffer: bufferData,
      update: this.update,
      makeDir: this.makeDir,
      purge: this.purge,
      restore: this.restore,
      paste: this.paste,
      copy: this.copy,
      cut: this.cut,
      rename: this.rename,
      publish: this.publish,
      unpublish: this.unpublish,
      remove: this.remove,
      download: this.download
    }
    return (
      <ActionsPanelView { ...props}/>
    )
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
  private makeDir (name: string): void {
    const { makeDir } = this.props.listActions
    makeDir(name)
  }
  private purge () {
    const { purgeTrash } = this.props.listActions
    const { deselect } = this.props.resourceSelectedActions
    const { loadingStart, loadingEnd } = this.props.loadingActions
    loadingStart()
    purgeTrash()
      .then(() => {
        deselect()
      })
      .then(() => {
        loadingEnd()
      })
  }
  private restore () {
    const { deselect } = this.props.resourceSelectedActions
    const { restoreResource } = this.props.listActions
    const { list, selected, isTrash } = this.props
    if (list !== null && selected !== null && list[selected] && isTrash) {
      restoreResource(list[selected].path)
        .then(() => {
          deselect()
        })
    }
  }
  private paste (): void {
    const { pasteResource } = this.props.listActions
    const { service, path, buffer } = this.props
    const copy = this.copy
    if (buffer[service]) {
      pasteResource(buffer[service].path, path, buffer[service].copy)
        .then(() => {
          // when resource has been moved it's path can be modified
          // so we should copy newly relocated resource to able to paste it further
          if (!buffer[service].copy) copy(buffer[service].id)
        })
    }
  }

  private copy (id?: string): void {
    const { copyResource } = this.props.bufferActions
    const { list, selected, service } = this.props
    if (list !== null && service) {
      if (id && list[id]) {
        // manually set resource to copy
        copyResource(id, list[id].path, service)
      } else if (selected !== null && list[selected]) {
        copyResource(list[selected].id, list[selected].path, service)
      }
    }
  }

  private cut (): void {
    const { cutResource } = this.props.bufferActions
    const { list, selected, service } = this.props
    if (list !== null && selected !== null && list[selected] && service) {
      cutResource(list[selected].id, list[selected].path, service)
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
    const { deselect } = this.props.resourceSelectedActions
    const { list, selected } = this.props
    if (list !== null && selected !== null && list[selected]) {
      removeResource(list[selected].path)
        .then(() => {
          deselect()
        })
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
    isTrash: state.active.isTrash,
    list: state.resources.list,
    buffer: state.buffer,
    service: state.active.service,
    path: state.active.path
  }
}

function mapDispatchToProps (dispatch) {
  return {
    listActions: bindActionCreators(listActions, dispatch),
    resourceSelectedActions: bindActionCreators(resourceSelectedActions, dispatch),
    dirActions: bindActionCreators(dirActions, dispatch),
    loadingActions: bindActionCreators(loadingActions, dispatch),
    bufferActions: bindActionCreators(bufferActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsPanel)
