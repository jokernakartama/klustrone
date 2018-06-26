import { renderStatus } from './FileManager'

export = IFileManagerComponent
export as namespace IFileManagerComponent

declare namespace IFileManagerComponent {
  interface Props {
    resourceListActions: any
    loadingActions: any
    resourceDirectioryActions: any
    resourceSelectedActions: any
    serviceListActions: any
    services: IServiceListState
    active: string
    path: string
    isTrash: boolean
  }

  interface State {
    status: renderStatus
    service: string
    path: string
    isTrash: boolean
  }
}