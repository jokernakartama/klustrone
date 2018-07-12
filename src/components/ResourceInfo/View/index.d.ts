export = IResourceInfoViewComponent
export as namespace IResourceInfoViewComponent

declare namespace IResourceInfoViewComponent {
  interface Props {
    loading: boolean
    isTrash: boolean
    info: IResourceDirData|IResourceData|null
    hasSelection: boolean
  }
}
