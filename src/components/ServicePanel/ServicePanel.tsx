import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as serviceListActions from '~/ducks/serviceList'
import ServicePanelView from './View'

class ServicePanel extends React.PureComponent<IServicePanelComponent.Props> {
  constructor (props) {
    super(props)
    this.disconnectService = this.disconnectService.bind(this)
    this.addService = this.addService.bind(this)
  }

  public render () {
    const { active, list } = this.props
    return (
      <ServicePanelView
        active={ active }
        list={ list }
        unmount={ this.disconnectService }
        mount={ this.addService }
      />
    )
  }

  private disconnectService (service: string): void {
    const { disconnectService } = this.props.serviceListActions
    disconnectService(service)
  }

  private addService (service: string): void {
    const { addService } = this.props.serviceListActions
    addService(service)
  }
}

function mapStateToProps (state) {
  return {
    active: state.active.service,
    list: state.services
  }
}

function mapDispatchToProps (dispatch) {
  return {
    serviceListActions: bindActionCreators(serviceListActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServicePanel)
