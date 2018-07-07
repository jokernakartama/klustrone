import React from 'react'

export = IServicePanelMobileViewComponent
export as namespace IServicePanelMobileViewComponent

declare namespace IServicePanelMobileViewComponent {
  interface Props {
    active: string|null
    list: IServiceListState
    percents: number|null
    isActiveMounted: boolean
    isActiveUnmounted: boolean
  }
}
