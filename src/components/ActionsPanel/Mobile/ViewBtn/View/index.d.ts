import { viewType } from '~/ducks/view/view'

export = IActionsPanelMobileViewBtnViewComponent
export as namespace IActionsPanelMobileViewBtnViewComponent

declare namespace IActionsPanelMobileViewBtnViewComponent {
  interface Props {
    change: (view: viewType) => void
    view: viewType
    blockName: string
  }
}
