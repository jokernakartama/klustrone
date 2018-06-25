import React from 'react'

export = IUIDialogComponent
export as namespace IUIDialogComponent

declare namespace IUIDialogComponent {
  interface Props {
    children?: React.ReactNode
    data: IModalActionPayload|false
    dialogActions: any
  }
}