import React from 'react'

export = IUIDialogPromptViewComponent
export as namespace IUIDialogPromptViewComponent

declare namespace IUIDialogPromptViewComponent {
  interface Props {
    defaultValue: string
    acceptLabel: string
    declineLabel: string
    accept: () => void
    decline: () => void
    onChange: (e: React.SyntheticEvent) => void
    onKeyPress: (e: React.KeyboardEvent) => void
  }
}