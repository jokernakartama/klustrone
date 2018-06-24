import React from 'react'

export = IFileManagerUnmountedViewComponent
export as namespace IFileManagerUnmountedViewComponent

declare namespace IFileManagerUnmountedViewComponent {
  interface Props {
    children?: React.ReactNode
    action: () => void
  }
}
