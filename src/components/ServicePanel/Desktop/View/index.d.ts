import React from 'react'

export = IServicePanelDesktopViewComponent
export as namespace IServicePanelDesktopViewComponent

declare namespace IServicePanelDesktopViewComponent {
  interface Props {
    visible: boolean
    selected: string|null
    active: string|null
    list: IServiceListState
    toggle: () => void
    pull: (service: string) => void
    unmount: (service: string) => void
    mount: (service: string) => void
  }
}