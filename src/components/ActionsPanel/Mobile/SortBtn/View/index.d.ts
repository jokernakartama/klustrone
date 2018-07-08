export = IActionsPanelMobileSortBtnViewComponent
export as namespace IActionsPanelMobileSortBtnViewComponent

declare namespace IActionsPanelMobileSortBtnViewComponent {
  interface Props {
    field: string
    asc: boolean
    change: (field: string, asc?: boolean) => void
    blockName: string
  }
}
