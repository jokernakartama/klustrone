import React from 'react'

export = IFileManagerUpdatedViewComponent
export as namespace IFileManagerUpdatedViewComponent

declare namespace IFileManagerUpdatedViewComponent {
  interface Props {
    children?: React.ReactNode
    action: () => void
  }
}
