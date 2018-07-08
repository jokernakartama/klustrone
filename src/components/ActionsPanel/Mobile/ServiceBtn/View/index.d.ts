import React from 'react'

export = IActionsPanelMobileServiceBtnViewComponent
export as namespace IActionsPanelMobileServiceBtnViewComponent

declare namespace IActionsPanelMobileServiceBtnViewComponent {
  interface Props {
    list: IServiceListState
    active: string
    mount: () => void
    unmount: () => void
    blockName: string
  }
}
