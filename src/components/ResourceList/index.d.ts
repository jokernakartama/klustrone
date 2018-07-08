export = IResourceListComponent
export as namespace IResourceListComponent

declare namespace IResourceListComponent {
  interface Props {
    serviceName: string
    path: string
    view: any
    resources: IResourceListActionPayload|null
    directory: IResourceDirData|null
    sort: ISortActionPayload
    isTrash: boolean
  }
}
