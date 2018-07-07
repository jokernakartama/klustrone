import React from 'react'

export = IUIDialogViewComponent
export as namespace IUIDialogViewComponent

declare namespace IUIDialogViewComponent {
  interface Props {
    payload: IModalActionPayload|false
    close: (data?: any) => void
  }
}