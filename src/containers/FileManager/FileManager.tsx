import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as activeServiceActions from '~/ducks/activeService'
import * as resourcePathActions from '~/ducks/resourcePath'
import * as resourceIsTrashActions from '~/ducks/resourceIsTrash'
import * as resourceListActions from '~/ducks/resourceList'
import * as resourceSelectedActions from '~/ducks/resourceSelected'
import * as loadingActions from '~/ducks/loading'
import * as resourceDirectioryActions from '~/ducks/resourceDirectory'
import * as serviceListActions from '~/ducks/serviceList'
import FileManagerView from '~/components/FileManagerView'
import { renderStatus } from '~/components/FileManagerView/FileManagerView'
import { parseLocation } from '~/api'
import { history } from '~/utils/history'

interface IFileManagerContainerProps {
  resourcePathActions: any
  activeServiceActions: any
  resourceIsTrashActions: any
  resourceListActions: any
  loadingActions: any
  resourceDirectioryActions: any
  resourceSelectedActions: any
  serviceListActions: any
  services: IServiceListState
}

interface IFileManagerContainerState {
  status: renderStatus
  service: string
  path: string
  isTrash: boolean
}

/**
 * Returns proper state according props and history changes.
 * @param {IFileManagerContainerProps} props - Next props
 * @param {IFileManagerContainerState} state - Previous state
 * @returns {(IFileManagerContainerState|false)}
 */
function setStatus (props: IFileManagerContainerProps, state?: IFileManagerContainerState): IFileManagerContainerState|null {
  const data = parseLocation(history.location.pathname)
  if (data) {
    const nextService = data.service
    const nextPath = data.path
    const nextIsTrash = data.isTrash
    const activeService = props.services[data.service]
    let nextStatus
    if (activeService) {
      // If previous state exists, service has not been changed and
      // status is about to change from UNMOUNTED to MOUNTED
      // simply mark resource list as "can be recieved"
      // instead of immidiate loading.
      if (state && state.status === renderStatus.UNMOUNTED && activeService.mounted && state.service === nextService) {
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
      if (activeService.mounted && state && state.status === renderStatus.UPDATED && state.service === nextService) {
        return null
      }
    } else {
      nextStatus = renderStatus.UNAVAILABLE
    }
    return {
      service: nextService,
      path: nextPath,
      isTrash: nextIsTrash,
      status: nextStatus
    }
  } else {
    // In fact, as the component renders in a proper <Route />,
    // the location is always can be parsed correctly.
    return null
  }
}

class FileManager extends React.Component<IFileManagerContainerProps, IFileManagerContainerState> {
  protected static getDerivedStateFromProps (nextProps, prevState) {
    const nextState = setStatus(nextProps, prevState)
    return nextState
  }
  public state = null
  private unlisten

  constructor (props) {
    super(props)
    const initialState = setStatus(props)
    if (initialState) {
      this.updateStore(initialState.service, initialState.path, initialState.isTrash)
      this.state = initialState
    }
  }

  public componentDidMount () {
    const { deselect } = this.props.resourceSelectedActions
    this.unlisten = history.listen((location) => {
      const nextState = setStatus(this.props, this.state)
      if (nextState) {
        deselect()
        this.updateStore(nextState.service, nextState.path, nextState.isTrash)
        this.clearDirectory(nextState)
        this.loadDirectory(nextState)
        this.setState(nextState)
      }
    })
    this.clearDirectory(this.state)
    this.loadDirectory(this.state)
  }

  public shouldComponentUpdate (nextProps, nextState) {
    // rerender component when the service mounted status has been changed
    // or the service has been changed
    // or status state has been updated internally
    if (
        nextProps.services[this.state.service].mounted !== this.props.services[this.state.service].mounted &&
        this.state.service === nextState.service ||
        this.state.service !== nextState.service ||
        this.state.status !== nextState.status
      ) {
      return true
    } else {
      return false
    }
  }

  public componentWillUnmount () {
    this.unlisten()
  }

  public render () {
    const { children } = this.props
    const status = this.state.status
    return (
      <FileManagerView serviceStatus={ status } action={ this.getAction() }>
        { children }
      </FileManagerView>
    )
  }

  /**
   * Clears directory data when a service changes.
   * @param {IFileManagerContainerState} nextState
   * @param {boolean} force - Whether the action should be forced
   */
  private clearDirectory (nextState: IFileManagerContainerState, force: boolean = false): void {
    const { updateList } = this.props.resourceListActions
    const { updateDir } = this.props.resourceDirectioryActions
    if (nextState.service !== this.state.service || force) {
      updateList(null)
      updateDir(null)
    }
  }

  /**
   * Loads resource list and directory meta
   * if the service is mounted
   * @param {IFileManagerContainerState} nextState
   * @param {boolean} force - Whether the action should be forced
   */
  private loadDirectory (nextState: IFileManagerContainerState, force: boolean = false): void {
    const { getList } = this.props.resourceListActions
    const { getMeta } = this.props.resourceDirectioryActions
    const { loadingStart, loadingEnd } = this.props.loadingActions
    const { status, path, isTrash } = nextState
    if (status === renderStatus.MOUNTED || force) {
      loadingStart()
      Promise.all([
        getMeta(path),
        getList(path, isTrash)
      ])
        .then(() => {
          loadingEnd()
        })
    }
  }

  /**
   * Simple wrapper to mount service
   */
  private mountService (): void {
    const { addService } = this.props.serviceListActions
    if (this.state) addService(this.state.service)
  }

  private getAction () {
    let action
    if (this.state.status === renderStatus.UPDATED) {
      action = () => {
        this.clearDirectory(this.state, true)
        this.loadDirectory(this.state, true)
        this.setState({ status: renderStatus.MOUNTED })
      }
    } else if (this.state.status === renderStatus.UNMOUNTED) {
      action = () => this.mountService()
    }
    return action
  }

  /**
   * Updates global store data if needed.
   * @param {string} service - The service name
   * @param {string} path - Directory id
   * @param {boolean} isTrash - Whether should mark the location as trashed
   */
  private updateStore (service: string, path: string, isTrash: boolean): void {
    const { updateResourcePath } = this.props.resourcePathActions
    const { selectService } = this.props.activeServiceActions
    const { updateTrashFlag } = this.props.resourceIsTrashActions
    selectService(service)
    updateResourcePath(path)
    updateTrashFlag(isTrash)
  }
}

function mapStateToProps (state) {
  return {
    services: state.services.list
  }
}

function mapDispatchToProps (dispatch) {
  return {
    activeServiceActions: bindActionCreators(activeServiceActions, dispatch),
    resourcePathActions: bindActionCreators(resourcePathActions, dispatch),
    resourceIsTrashActions: bindActionCreators(resourceIsTrashActions, dispatch),
    resourceListActions: bindActionCreators(resourceListActions, dispatch),
    resourceSelectedActions: bindActionCreators(resourceSelectedActions, dispatch),
    loadingActions: bindActionCreators(loadingActions, dispatch),
    resourceDirectioryActions: bindActionCreators(resourceDirectioryActions, dispatch),
    serviceListActions: bindActionCreators(serviceListActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileManager)
