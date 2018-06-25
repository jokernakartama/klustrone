import './styles/UIDialogInfoView.styl'
import React from 'react'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'dialog'

const UIDialogInfoView: React.SFC<IUIDialogInfoViewComponent.Props> = ({ accept, acceptLabel }) => {
  const buttonWrapClass = bem({ block: BLOCK_NAME, elem: 'button-wrapper' })
  const acceptClass = bem([
    { block: BLOCK_NAME, elem: 'button', mod: { type: 'positive' } },
    { block: 'button' }
  ])

  return (
    <div className={ buttonWrapClass }>
        <button autoFocus={ true } onClick={ accept } className={ acceptClass }>
          { acceptLabel }
        </button>
    </div>
  )
}

export default UIDialogInfoView
