import React from 'react'

export = IUIOptionsButtonViewComponent
export as namespace IUIOptionsButtonViewComponent

declare namespace IUIOptionsButtonViewComponent {
  interface Props {
    children?: React.ReactNode
    options: IUIOptionsButtonComponent.Option[]
    className?: string
    visible: boolean
    toggle: () => void
    hide: () => void
  }
}
