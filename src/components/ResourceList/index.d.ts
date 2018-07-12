export = IResourceListComponent
export as namespace IResourceListComponent

declare namespace IResourceListComponent {
  interface Props {
    service: string
    path: ActiveStatePath
    view: any
    resources: IResourceListActionPayload|null
    directory: IResourceDirData|null
    sort: ISortActionPayload
    isTrash: ActiveStateTrashFlag
  }
}
