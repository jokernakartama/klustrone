import { renderStatus } from './FileManager'

export = IFileManagerComponent
export as namespace IFileManagerComponent

declare namespace IFileManagerComponent {
  interface Props {
    resourceListActions: any
    loadingActions: any
    resourceDirectioryActions: any
    serviceListActions: any
    services: IServiceListState
    active: IActiveState
  }

  interface State {
    status: renderStatus
  }
}