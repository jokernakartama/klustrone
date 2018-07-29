import React from 'react'

export = IServiceManagerComponent
export as namespace IServiceManagerComponent

declare namespace IServiceManagerComponent {
  interface Props {
    children?: React.ReactNode
    serviceListActions: any
    resourceBufferActions: any
    list: IServiceListState
  }
}