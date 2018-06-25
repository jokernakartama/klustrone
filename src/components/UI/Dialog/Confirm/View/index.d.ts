import React from 'react'

export = IUIDialogConfirmViewComponent
export as namespace IUIDialogConfirmViewComponent

declare namespace IUIDialogConfirmViewComponent {
  interface Props {
    acceptLabel: string
    declineLabel: string
    accept: () => void
    decline: () => void
  }
}