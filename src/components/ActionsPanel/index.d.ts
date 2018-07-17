export = IActionsPanelComponent
export as namespace IActionsPanelComponent

declare namespace IActionsPanelComponent {
  interface Props {
    list: IResourceListActionPayload
    path: string
    service: string
    selected: string|null
    buffer: IResourceBufferActionPayload
    isTrash: boolean
    listActions: any
    loadingActions: any
    resourceSelectedActions: any
    dirActions: any
    bufferActions: any
  }
}
