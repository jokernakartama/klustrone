export = IResourceListComponent
export as namespace IResourceListComponent

declare namespace IResourceListComponent {
  interface Props {
    serviceName: string
    path: string
    selected: string|null
    view: any
    resources: IResourceListActionPayload|null
    directory: IDirResource|null
    sort: ISortActionPayload
    isTrash: boolean
    resourceSelectedActions: any
  }
}
