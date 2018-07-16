import './styles/UIDialogPromptView.styl'
import React from 'react'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'dialog'

const UIDialogPromptView: React.SFC<IUIDialogPromptViewComponent.Props> = (props) => {
  const {
    acceptLabel,
    declineLabel,
    accept,
    decline,
    defaultValue,
    onChange,
    onKeyPress
  } = props

  const inputWrapClass = bem({ block: BLOCK_NAME, elem: 'input-wrapper' })
  const inputClass = bem([
    { block: BLOCK_NAME, elem: 'input', mod: { type: 'text' } },
    { block: 'input', mod: { type: 'text' } }
  ])
  const buttonWrapClass = bem({ block: BLOCK_NAME, elem: 'button-wrapper' })
  const acceptClass = bem([
    { block: BLOCK_NAME, elem: 'button', mod: { type: 'positive' } },
    { block: 'button' }
  ])
  const declineClass = bem([
    { block: BLOCK_NAME, elem: 'button', mod: { type: 'negative' } },
    { block: 'button' }
  ])

  return (
    <React.Fragment>
      <div className={ inputWrapClass }>
        <input
          className={ inputClass }
          type='text'
          defaultValue={ defaultValue }
          autoFocus={ true }
          onChange={ onChange }
          onKeyPress={ onKeyPress }
        />
      </div>
      <div className={ buttonWrapClass }>
        <button onClick={ decline } className={ declineClass }>
          { declineLabel }
        </button>
        <button onClick={ accept } className={ acceptClass }>
          { acceptLabel }
        </button>
      </div>
    </React.Fragment>
  )
}

export default UIDialogPromptView
