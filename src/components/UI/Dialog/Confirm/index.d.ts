import React from 'react'

export = IUIDialogConfirmComponent
export as namespace IUIDialogConfirmComponent

declare namespace IUIDialogConfirmComponent {
  interface Props {
    data?: any
    acceptLabel: string
    declineLabel: string
    close: (val?: any) => void
  }
}