export = IActionsPanelComponent
export as namespace IActionsPanelComponent

declare namespace IActionsPanelComponent {
  interface Props {
    list: IResourceListActionPayload
    path: string
    active: string
    selected: string|null
    buffer: IResourceBufferActionPayload
    isTrash: boolean
    listActions: any
    loadingActions: any
    dirActions: any
    bufferActions: any
  }
}
