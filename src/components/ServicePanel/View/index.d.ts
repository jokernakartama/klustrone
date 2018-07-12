import React from 'react'

export = IServicePanelViewComponent
export as namespace IServicePanelViewComponent

declare namespace IServicePanelViewComponent {
  interface Props {
    active: ActiveStateService
    list: IServiceListState
    unmount: (service: string) => void
    mount: (service: string) => void
  }
}