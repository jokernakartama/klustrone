import React from 'react'

export = IServicePanelMobileComponent
export as namespace IServicePanelMobileComponent

declare namespace IServicePanelMobileComponent {
  interface Props {
    active: string|null
    list: IServiceListState
    unmount: (service: string) => void
    mount: (service: string) => void
  }
}
