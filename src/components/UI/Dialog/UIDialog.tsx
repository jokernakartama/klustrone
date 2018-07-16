import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import UIDialogView from './View'
import * as dialogActions from '~/ducks/modal'
import { history } from '~/utils/history'

class UIDialog extends React.PureComponent<IUIDialogComponent.Props> {
  private unlisten

  constructor (props) {
    super(props)
  }
  public componentDidMount () {
    const { closeDialog } = this.props.dialogActions
    this.unlisten = history.listen((location) => {
      if (this.props.data !== false) closeDialog()
    })
  }

  public componentWillUnmount () {
    this.unlisten()
  }

  public render () {
    const { data } = this.props
    const { closeDialog } = this.props.dialogActions
    return (
      <UIDialogView payload={ data } close={ closeDialog }/>
    )
  }
}

function mapStateToProps (state) {
  return {
    data: state.modal
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dialogActions: bindActionCreators(dialogActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UIDialog)
