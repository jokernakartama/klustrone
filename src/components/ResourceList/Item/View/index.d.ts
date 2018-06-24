export = IResourceListItemViewComponent
export as namespace IResourceListItemViewComponent

declare namespace IResourceListItemViewComponent {
  interface Props {
    id?: string
    href?: string
    name?: string
    path: string
    view: any
    preview?: string|null
    type?: string
    size?: number
    isPublic?: boolean
    isSelected?: boolean
    isTrash?: boolean
    onDragStartHandler?: (e?: any) => void
    onClickHandler?: (e?: any) => void
    onDoubleClickHandler?: (e?: any) => void
  }
}