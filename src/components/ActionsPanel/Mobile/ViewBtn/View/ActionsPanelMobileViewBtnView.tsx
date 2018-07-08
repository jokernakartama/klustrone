import './styles/ActionsPanelMobileViewBtnView.styl'
import React from 'react'
import UIOptionsButton from '~/components/UI/OptionsButton'
import { loc } from '~/constants'
import { viewType } from '~/ducks/view/view'

const ActionsPanelMobileViewBtnView: React.SFC<IActionsPanelMobileViewBtnViewComponent.Props> = (props) => {
  const { blockName, view, change } = props
  const options: IUIOptionsButtonComponent.Option[] = [
    { type: 'cancel', label: loc.LABEL_CLOSE },
    { type: 'separator', label: '' }
  ]
  options.push({
    type: 'radio',
    label: loc.VIEW_LIST,
    checked: (view === viewType.LIST),
    action: () => change(viewType.LIST)
  })
  options.push({
    type: 'radio',
    label: loc.VIEW_TILE,
    checked: (view === viewType.TILE),
    action: () => change(viewType.TILE)
  })

  return (
    <UIOptionsButton className={ blockName } options={ options }>
      { loc.M_ACTION_PANEL_VIEW_BUTTON }
    </UIOptionsButton>
  )
}

export default ActionsPanelMobileViewBtnView
