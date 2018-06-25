import React from 'react'

export = IUIDialogPromptComponent
export as namespace IUIDialogPromptComponent

declare namespace IUIDialogPromptComponent {
  interface Props {
    children?: React.ReactNode
    data?: string
    acceptLabel: string
    declineLabel: string
    close: (val?: string) => void
  }

  interface State {
    data?: string
  }
}