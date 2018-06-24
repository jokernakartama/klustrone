import React from 'react'

export = IResourceListViewComponent
export as namespace IResourceListViewComponent

declare namespace IResourceListViewComponent {
  interface Props {
    children?: React.ReactNode
    view: string
  }
}
