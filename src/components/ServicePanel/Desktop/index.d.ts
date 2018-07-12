export = IServicePanelDesktopComponent
export as namespace IServicePanelDesktopComponent

declare namespace IServicePanelDesktopComponent {
  interface Props {
    active: ActiveStateService
    list: IServiceListState
    unmount: (service: string) => void
    mount: (service: string) => void
  }
  interface State {
    visible: boolean
    selected: string|null
  }
}