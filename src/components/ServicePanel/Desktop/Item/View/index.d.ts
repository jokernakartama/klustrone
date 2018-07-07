export = IServicePanelDesktopItemViewComponent
export as namespace IServicePanelDesktopItemViewComponent

declare namespace IServicePanelDesktopItemViewComponent {
  interface Props {
    name: string
    isActive: boolean
    isSelected: boolean
    isMounted: boolean
    pull: () => void
    mount: () => void
    unmount: () => void
  }
}