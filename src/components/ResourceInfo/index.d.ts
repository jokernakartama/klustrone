export = IResourceInfoComponent
export as namespace IResourceInfoComponent

declare namespace IResourceInfoComponent {
  interface Props {
    loading: boolean
    dir: IResourceDirData|null
    list: IResourceListActionPayload
    selected: string|null
    isTrash: ActiveStateTrashFlag
  }
}
