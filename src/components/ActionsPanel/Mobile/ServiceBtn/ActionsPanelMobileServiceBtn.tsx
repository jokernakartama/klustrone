import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as serviceListActions from '~/ducks/serviceList'
import ActionsPanelMobileServiceBtnView from './View'

const ActionsPanelMobileServiceBtn: React.SFC<IActionsPanelMobileServiceBtnComponent.Props> = (props) => {
  const { list, active, blockName } = props
  const { addService, disconnectService } = props.serviceListActions
  const mount = active !== null ? () => addService(active) : () => {}
  const unmount = active !== null ? () => disconnectService(active) : () => {}
  return (
    <ActionsPanelMobileServiceBtnView
      list={ list }
      active={ active }
      mount={ mount }
      unmount={ unmount }
      blockName={ blockName }
    />
  )
}

function mapStateToProps (state) {
  return {
    active: state.services.active,
    list: state.services.list
  }
}

function mapDispatchToProps (dispatch) {
  return {
    serviceListActions: bindActionCreators(serviceListActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsPanelMobileServiceBtn)
