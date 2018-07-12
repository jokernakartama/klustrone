import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as serviceListActions from '~/ducks/serviceList'
import ActionsPanelMobileServiceBtnView from './View'

const ActionsPanelMobileServiceBtn: React.SFC<IActionsPanelMobileServiceBtnComponent.Props> = (props) => {
  const { list, service, blockName } = props
  const { addService, disconnectService } = props.serviceListActions
  const mount = service !== null ? () => addService(service) : () => {}
  const unmount = service !== null ? () => disconnectService(service) : () => {}
  return (
    <ActionsPanelMobileServiceBtnView
      list={ list }
      active={ service }
      mount={ mount }
      unmount={ unmount }
      blockName={ blockName }
    />
  )
}

function mapStateToProps (state) {
  return {
    service: state.active.service,
    list: state.services
  }
}

function mapDispatchToProps (dispatch) {
  return {
    serviceListActions: bindActionCreators(serviceListActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsPanelMobileServiceBtn)
