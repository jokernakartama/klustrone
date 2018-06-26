import React from 'react'

export = IMainComponent
export as namespace IMainComponent

declare namespace IMainComponent {
  interface Props {
    loading?: boolean
    activeServiceActions: any
    resourcePathActions: any
    resourceIsTrashActions: any
    resourceListActions: any
    resourceSelectedActions: any
    loadingActions: any
    resourceDirectioryActions: any
    serviceListActions: any
  }
}