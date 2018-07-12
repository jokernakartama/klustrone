import React from 'react'

export = IServicePanelComponent
export as namespace IServicePanelComponent

declare namespace IServicePanelComponent {
  interface Props {
    serviceListActions: any
    active: ActiveStateService
    list: IServiceListState
  }
}