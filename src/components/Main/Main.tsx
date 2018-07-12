import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as activeStateActions from '~/ducks/activeState'
import * as resourceListActions from '~/ducks/resourceList'
import * as resourceSelectedActions from '~/ducks/resourceSelected'
import * as resourceDirectioryActions from '~/ducks/resourceDirectory'
import MainView from './View'
import { parseLocation } from '~/api'
import { history } from '~/utils/history'

class Main extends React.PureComponent<IMainComponent.Props> {
  private unlisten
  constructor (props) {
    super(props)
    this.updateStore()
  }
  public componentDidMount () {
    this.unlisten = history.listen((location) => {
      this.updateStore()
    })
  }

  public componentWillUnmount () {
    this.unlisten()
  }

  public render () {
    const { loading } = this.props
    return <MainView loading={ loading } />
  }

  /**
   * Parses location to update initial store data
   */
  private updateStore (): void {
    const { clearStates, updateStates } = this.props.activeStateActions
    const { deselect } = this.props.resourceSelectedActions
    const { updateList } = this.props.resourceListActions
    const { updateDir } = this.props.resourceDirectioryActions
    const data = parseLocation(history.location.pathname)
    if (data) {
      deselect()
      updateList(null)
      updateDir(null)
      if (data.service) {
        updateStates(data)
      } else {
        clearStates()
      }
    }
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading
  }
}

function mapDispatchToProps (dispatch) {
  return {
    activeStateActions: bindActionCreators(activeStateActions, dispatch),
    resourceListActions: bindActionCreators(resourceListActions, dispatch),
    resourceSelectedActions: bindActionCreators(resourceSelectedActions, dispatch),
    resourceDirectioryActions: bindActionCreators(resourceDirectioryActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
