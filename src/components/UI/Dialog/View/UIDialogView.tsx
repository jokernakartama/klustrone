import './styles/UIDialogView.styl'
import React from 'react'
import UIDialogInfo from '../Info'
import UIDialogConfirm from '../Confirm'
import UIDialogPrompt from '../Prompt'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'dialog'

class UIDialogView extends React.PureComponent<IUIDialogViewComponent.Props> {
  constructor (props) {
    super(props)
    this.closeDialog = this.closeDialog.bind(this)
  }

  public componentDidMount () {
    window.document.addEventListener('keyup', this.closeDialog)
  }

  public componentWillUnmount () {
    window.document.removeEventListener('keyup', this.closeDialog)
  }

  public render () {
    const { payload, close } = this.props
    const wrapperClass = bem([{ block: BLOCK_NAME + '-wrapper', mod: { open: payload !== false } }, { block: 'overlay' }])
    let blockClass = bem({ block: BLOCK_NAME })
    if (payload && payload.type) {
      blockClass = bem({ block: BLOCK_NAME, mod: { type: payload.type, open: true } })
    }
    let content = null
    if (payload && payload.type) {
      const { title, message, type } = payload as IModalActionPayload
      const titleClass = bem({ block: BLOCK_NAME, elem: 'message' })
      const messageClass = bem({ block: BLOCK_NAME, elem: 'message' })
      const controlsClass = bem({ block: BLOCK_NAME, elem: 'message' })

      let controls = null
      if (type === 'info' || type === 'error' || type === 'warning') {
        controls = <UIDialogInfo acceptLabel={ payload.accept } close={ close } />
      } else if (type === 'confirm') {
        controls = <UIDialogConfirm data={ payload.data } acceptLabel={ payload.accept } declineLabel={ payload.decline } close={ close } />
      } else if (type === 'prompt') {
        controls = <UIDialogPrompt data={ payload.data } acceptLabel={ payload.accept } declineLabel={ payload.decline } close={ close } />
      }
      content = (
        <React.Fragment>
          { title && title !== '' && <div className={ titleClass }>{ title }</div> }
          <div className={ messageClass }>{ message && this.breakText(message) }</div>
          <div className={ controlsClass }>
            { controls }
          </div>
        </React.Fragment>
      )
    }
    return (
      <div className={ wrapperClass }>
        <div className={ blockClass }>
          { content }
        </div>
      </div>
    )
  }
  private breakText (str: string) {
    const parts = str.split('\n')
    const len = parts.length - 1
    return parts.map((val, index) => {
      return <React.Fragment key={ index }>{ val } { index < len && <br /> }</React.Fragment>
    })
  }

  private closeDialog (e) {
    if (e.keyCode === 27) {
      this.props.close()
    }
  }
}

export default UIDialogView
