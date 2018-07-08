import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as viewActions from '~/ducks/view'
import ActionsPanelMobileViewBtnView from './View'

const ActionsPanelMobileViewBtn: React.SFC<IActionsPanelMobileViewBtnComponent.Props> = (props) => {
  const { view, blockName } = props
  const { changeView } = props.viewActions
  return (
    <ActionsPanelMobileViewBtnView
      change={ changeView }
      view={ view }
      blockName={ blockName }
    />
  )
}

function mapStateToProps (state) {
  return {
    view: state.view
  }
}

function mapDispatchToProps (dispatch) {
  return {
    viewActions: bindActionCreators(viewActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsPanelMobileViewBtn)
