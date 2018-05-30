import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as listActions from '~/ducks/resourceList'
import * as dirActions from '~/ducks/resourceDirectory'
import * as loadingActions from '~/ducks/loading'

interface IDirectoryActionsContainerProps {
  children?: React.ReactNode
  isTrash: boolean
  listActions: any
  dirActions: any
  loadingActions: any
}

class DirectoryActions extends React.PureComponent<IDirectoryActionsContainerProps> {
  constructor (props) {
    super(props)
    this.update = this.update.bind(this)
    this.makeDir = this.makeDir.bind(this)
    this.purge = this.purge.bind(this)
  }

  public render () {
    const { children, isTrash } = this.props
    const props = {
      isTrash,
      update: this.update,
      makeDir: this.makeDir,
      purge: this.purge
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
}

function mapStateToProps (state) {
  return {
    isTrash: state.resources.isTrash
  }
}

function mapDispatchToProps (dispatch) {
  return {
    listActions: bindActionCreators(listActions, dispatch),
    dirActions: bindActionCreators(dirActions, dispatch),
    loadingActions: bindActionCreators(loadingActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryActions)
