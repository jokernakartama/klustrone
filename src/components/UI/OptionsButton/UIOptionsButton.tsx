import React from 'react'
import UIOptionsButtonView from './View'

class UIOptionsButton extends React.PureComponent<IUIOptionsButtonComponent.Props, IUIOptionsButtonComponent.State> {
  public state = {
    visible: false
  }
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.hide = this.hide.bind(this)
  }

  public render () {
    const { children, options, className } = this.props
    return (
      <UIOptionsButtonView
        options={ options }
        visible={ this.state.visible }
        toggle={ this.toggle }
        hide={ this.hide }
        className={ className }
      >
        { children }
      </UIOptionsButtonView>
    )
  }

  private toggle (): void {
    this.setState({
      visible: !this.state.visible
    })
  }

  private hide (): void {
    this.setState({
      visible: false
    })
  }
}

export default UIOptionsButton
