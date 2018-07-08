import { viewType } from '~/ducks/view/view'

export = IActionsPanelMobileViewBtnComponent
export as namespace IActionsPanelMobileViewBtnComponent

declare namespace IActionsPanelMobileViewBtnComponent {
  interface Props {
    view: viewType
    viewActions: any
    blockName: string
  }
}
