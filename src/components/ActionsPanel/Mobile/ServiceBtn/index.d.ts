import React from 'react'

export = IActionsPanelMobileServiceBtnComponent
export as namespace IActionsPanelMobileServiceBtnComponent

declare namespace IActionsPanelMobileServiceBtnComponent {
  interface Props {
    service: ActiveStateService
    list: IServiceListState
    serviceListActions: any
    blockName: string
  }
}
