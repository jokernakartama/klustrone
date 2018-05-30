import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as viewActions from '~/ducks/view'
import { viewType } from '~/ducks/view/view'

interface IViewActionsContainerProps {
  children?: React.ReactNode
  view: viewType
  viewActions: any
}

class ViewActions extends React.PureComponent<IViewActionsContainerProps> {
  constructor (props) {
    super(props)
  }

  public render () {
    const { children, view } = this.props
    const props = {
      view,
      change: this.changeView
    }
    const content = React.isValidElement(children) ? React.cloneElement(children, props) : children || null
    return content
  }

  private changeView (view: viewType): void {
    const { changeView } = this.props.viewActions
    changeView(view)
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewActions)
