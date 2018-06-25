import React from 'react'
import UIDialogConfirmView from './View'

const UIDialogConfirm: React.SFC<IUIDialogConfirmComponent.Props> = (props) => {
  const { data, acceptLabel, declineLabel, close } = props
  const accept = () => close(data)
  const decline = () => close()
  return (
    <UIDialogConfirmView
      acceptLabel={ acceptLabel }
      declineLabel={ declineLabel }
      accept={ accept }
      decline={ decline }
    />
  )
}

export default UIDialogConfirm
