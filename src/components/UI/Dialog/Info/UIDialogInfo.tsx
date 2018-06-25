import React from 'react'
import UIDialogInfoView from './View'

const UIDialogInfo: React.SFC<IUIDialogInfoComponent.Props> = ({ acceptLabel, close }) => {
  const accept = () => close(true)

  return (
    <UIDialogInfoView
      acceptLabel={ acceptLabel }
      accept={ accept }
    />
  )
}

export default UIDialogInfo
