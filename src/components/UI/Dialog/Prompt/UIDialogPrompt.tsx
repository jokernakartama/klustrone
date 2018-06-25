import React from 'react'
import UIDialogPromptView from './View'

class UIDialogPrompt extends React.PureComponent<IUIDialogPromptComponent.Props, IUIDialogPromptComponent.State> {
  public state
  constructor (props) {
    super(props)
    this.onChangeHandler = this.onChangeHandler.bind(this)
    this.onKeyPressHandler = this.onKeyPressHandler.bind(this)
    this.state = {
      data: props.data
    }
  }

  public render () {
    const { acceptLabel, declineLabel, close } = this.props
    const { data } = this.state
    const accept = () => close(data)
    const decline = () => close()

    return (
      <UIDialogPromptView
        defaultValue={ data }
        acceptLabel={ acceptLabel }
        declineLabel={ declineLabel }
        accept={ accept }
        decline={ decline }
        onChange={ this.onChangeHandler }
        onKeyPress={ this.onKeyPressHandler }
      />
    )
  }

  private onChangeHandler (e: React.SyntheticEvent): void {
    const input = e.target as HTMLInputElement
    this.setState({
      data: input.value
    })
  }

  private onKeyPressHandler (e: React.KeyboardEvent): void {
    const input = e.target as HTMLInputElement
    // if cursor at the end of string,
    // key "enter" accepts the changes
    if (e.charCode === 13) {
      if (input.selectionStart === input.value.length && input.value.length > 0) {
        this.props.close(this.state.data)
      }
    }
  }
}

export default UIDialogPrompt
