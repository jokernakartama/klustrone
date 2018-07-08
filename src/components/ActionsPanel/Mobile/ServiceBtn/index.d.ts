import React from 'react'

export = IActionsPanelMobileServiceBtnComponent
export as namespace IActionsPanelMobileServiceBtnComponent

declare namespace IActionsPanelMobileServiceBtnComponent {
  interface Props {
    active: string
    list: IServiceListState
    serviceListActions: any
    blockName: string
  }
}
