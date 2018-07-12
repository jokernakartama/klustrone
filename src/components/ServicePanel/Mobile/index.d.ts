import React from 'react'

export = IServicePanelMobileComponent
export as namespace IServicePanelMobileComponent

declare namespace IServicePanelMobileComponent {
  interface Props {
    active: ActiveStateService
    list: IServiceListState
    unmount: (service: string) => void
    mount: (service: string) => void
  }
}
