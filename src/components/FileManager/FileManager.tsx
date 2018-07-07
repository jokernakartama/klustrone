import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as resourceListActions from '~/ducks/resourceList'
import * as resourceSelectedActions from '~/ducks/resourceSelected'
import * as loadingActions from '~/ducks/loading'
import * as resourceDirectioryActions from '~/ducks/resourceDirectory'
import * as serviceListActions from '~/ducks/serviceList'
import FileManagerView from './View'
import FileManagerUpdated from './Updated'
import FileManagerUnmounted from './Unmounted'
import NotFound from '~/components/NotFound'

export enum renderStatus {
  MOUNTED, // when the service is mounted initially
  UNMOUNTED, // when the service is unmounted
  UPDATED, // when the service is mounted recently, but resource list is null
  UNAVAILABLE // when the service does not exist in serviceMap
}

class FileManager extends React.Component<IFileManagerComponent.Props, IFileManagerComponent.State> {
  public state = null

  constructor (props) {
    super(props)
    this.state = {
      status: this.setStatus()
    }
  }

  public componentDidMount () {
    if (this.state.status === renderStatus.MOUNTED) {
      this.loadDirectory()
    }
  }

  public componentDidUpdate (prevProps, prevState) {
    const { deselect } = this.props.resourceSelectedActions
    const nextStatus = this.setStatus(prevProps)
    if (nextStatus !== this.state.status && nextStatus !== null) {
      this.setState({
        status: nextStatus
      })
    }
    if (
      (this.state.status !== prevState.status && nextStatus === renderStatus.MOUNTED) ||
      this.props.path !== prevProps.path ||
      this.props.isTrash !== prevProps.isTrash ||
      this.props.active !== prevProps.active && this.state.status === renderStatus.MOUNTED
    ) {
      deselect()
      this.clearDirectory()
      this.loadDirectory()
    }
  }

  public render () {
    const { children } = this.props
    const status = this.state.status
    const action = this.getAction()
    let content = null
    if (status === renderStatus.UNAVAILABLE) {
      content = <NotFound />
    } else if (status === renderStatus.UPDATED) {
      content = <FileManagerUpdated action={ action } />
    } else if (status === renderStatus.UNMOUNTED) {
      content = <FileManagerUnmounted action={ action } />
    } else if (status === renderStatus.MOUNTED) {
      content = <FileManagerView> { children } </FileManagerView>
    }
    return content
  }

  /**
   * Clears directory data when a service changes.
   */
  private clearDirectory (): void {
    const { updateList } = this.props.resourceListActions
    const { updateDir } = this.props.resourceDirectioryActions
    updateList(null)
    updateDir(null)
  }

  private loadDirectory (): void {
    const { getList } = this.props.resourceListActions
    const { getMeta } = this.props.resourceDirectioryActions
    const { loadingStart, loadingEnd } = this.props.loadingActions
    const { path, isTrash } = this.props

    loadingStart()
    Promise.all([
      getMeta(path),
      getList(path, isTrash)
    ])
      .then(() => {
        loadingEnd()
      })
  }

  private getAction () {
    const { addService } = this.props.serviceListActions
    const { status } = this.state
    const { active } = this.props
    let action
    if (status === renderStatus.UPDATED) {
      action = () => {
        this.clearDirectory()
        this.loadDirectory()
        this.setState({ status: renderStatus.MOUNTED })
      }
    } else if (status === renderStatus.UNMOUNTED) {
      action = () => {
        if (this.state) addService(active)
      }
    }
    return action
  }

  private setStatus (prevProps?: IFileManagerComponent.Props): renderStatus {
    const activeService = this.props.services[this.props.active]
    let nextStatus
    if (activeService) {
      // If previous state exists, service has not been changed and
      // status is about to change from UNMOUNTED to MOUNTED
      // simply mark resource list as "can be recieved"
      // instead of immidiate loading.
      if (this.state && this.state.status === renderStatus.UNMOUNTED && activeService.mounted && prevProps && prevProps.active === this.props.active) {
        nextStatus = renderStatus.UPDATED
      } else if (activeService.mounted) {
        nextStatus = renderStatus.MOUNTED
      } else if (!activeService.mounted) {
        nextStatus = renderStatus.UNMOUNTED
      }
      // When the service uses timer to unmount it appears to periodically
      // change store. This condition prevents status changes, when
      // service mount flag has been updated already (to true) and status
      // is going to switch from UPDATED to MOUNTED. This behavior
      // would be incorrect, as the MOUNTED status should be set only when
      // the service is switched or on the initial boot (when there is no state).
      if (activeService.mounted && this.state && this.state.status === renderStatus.UPDATED && prevProps.active === this.props.active) {
        return null
      }
    } else {
      nextStatus = renderStatus.UNAVAILABLE
    }
    return nextStatus
  }
}

function mapStateToProps (state) {
  return {
    services: state.services.list,
    active: state.services.active,
    path: state.resources.path,
    isTrash: state.resources.isTrash
  }
}

function mapDispatchToProps (dispatch) {
  return {
    resourceListActions: bindActionCreators(resourceListActions, dispatch),
    resourceSelectedActions: bindActionCreators(resourceSelectedActions, dispatch),
    loadingActions: bindActionCreators(loadingActions, dispatch),
    resourceDirectioryActions: bindActionCreators(resourceDirectioryActions, dispatch),
    serviceListActions: bindActionCreators(serviceListActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileManager)
