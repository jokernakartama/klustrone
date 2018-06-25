import React from 'react'

export = IUIDialogInfoViewComponent
export as namespace IUIDialogInfoViewComponent

declare namespace IUIDialogInfoViewComponent {
    interface Props {
      acceptLabel: string
      accept: () => void
    }
}