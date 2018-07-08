export = IResourceListItemComponent
export as namespace IResourceListItemComponent

declare namespace IResourceListItemComponent {
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
    isTrash?: boolean
    selected: string|null
    resourceSelectedActions: any
  }
}
