import React from 'react'

export = IUIScrollAreaViewComponent
export as namespace IUIScrollAreaViewComponent

declare namespace IUIScrollAreaViewComponent {
  interface Props {
    children?: React.ReactNode
    domRef?: any
    style?: object
    className?: string
  }
}