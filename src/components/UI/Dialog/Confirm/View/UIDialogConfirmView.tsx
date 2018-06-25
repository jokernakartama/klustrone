import './styles/UIDialogConfirmView.styl'
import React from 'react'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'dialog'

const UIDialogConfirmView: React.SFC<IUIDialogConfirmViewComponent.Props> = (props) => {
  const { acceptLabel, declineLabel, accept, decline } = props
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
    <div className={ buttonWrapClass }>
      <button onClick={ decline } className={ declineClass }>
        { declineLabel }
      </button>
      <button autoFocus={ true } onClick={ accept } className={ acceptClass }>
        { acceptLabel }
      </button>
    </div>
  )
}

export default UIDialogConfirmView
