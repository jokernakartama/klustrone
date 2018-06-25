import React from 'react'

export = IUIDialogInfoComponent
export as namespace IUIDialogInfoComponent

declare namespace IUIDialogInfoComponent {
  interface Props {
    acceptLabel: string
    close: (val: boolean) => void
  }
}