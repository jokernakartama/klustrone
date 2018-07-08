import './styles/ActionsPanelMobileSortBtnView.styl'
import React from 'react'
import UIOptionsButton from '~/components/UI/OptionsButton'
import { loc } from '~/constants'

const ActionsPanelMobileSortBtnView: React.SFC<IActionsPanelMobileSortBtnViewComponent.Props> = (props) => {
  const { blockName, field, asc, change } = props
  const options: IUIOptionsButtonComponent.Option[] = [
    { type: 'cancel', label: loc.LABEL_CLOSE },
    { type: 'separator', label: '', close: false }
  ]
  options.push({
    type: 'radio',
    label: loc.SORT_BY_NAME,
    checked: (field === 'name'),
    action: () => change('name', asc)
  })
  options.push({
    type: 'radio',
    label: loc.SORT_BY_SIZE,
    checked: (field === 'size'),
    action: () => change('size', asc)
  })
  options.push({
    type: 'radio',
    label: loc.SORT_BY_TYPE,
    checked: (field === 'type'),
    action: () => change('type', asc)
  })
  options.push({
    type: 'radio',
    label: loc.SORT_BY_PUBLIC,
    checked: (field === 'publicLink'),
    action: () => change('publicLink', asc)
  })
  options.push({ type: 'separator', label: '', close: false })
  options.push({ type: 'radio', label: loc.SORT_ASCENDING, checked: asc, action: () => change(field, true) })
  options.push({ type: 'radio', label: loc.SORT_DESCENDING, checked: !asc, action: () => change(field, false) })

  return (
    <UIOptionsButton className={ blockName } options={ options }>
      { loc.M_ACTION_PANEL_SORT_BUTTON }
    </UIOptionsButton>
  )
}

export default ActionsPanelMobileSortBtnView
