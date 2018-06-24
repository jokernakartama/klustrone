import { renderStatus } from './FileManager'

export = IFileManagerComponent
export as namespace IFileManagerComponent

declare namespace IFileManagerComponent {
  interface Props {
    resourcePathActions: any
    activeServiceActions: any
    resourceIsTrashActions: any
    resourceListActions: any
    loadingActions: any
    resourceDirectioryActions: any
    resourceSelectedActions: any
    serviceListActions: any
    services: IServiceListState
  }

  interface State {
    status: renderStatus
    service: string
    path: string
    isTrash: boolean
  }
}