import React from 'react'

export = IUIIconViewComponent
export as namespace IUIIconViewComponent

declare namespace IUIIconViewComponent {
  interface Props {
    children?: React.ReactNode
    className?: string
    icon: string
  }
}