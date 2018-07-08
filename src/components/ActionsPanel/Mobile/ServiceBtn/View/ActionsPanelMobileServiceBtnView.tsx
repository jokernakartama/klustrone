import './styles/ActionsPanelMobileServiceBtnView.styl'
import React from 'react'
import UIOptionsButton from '~/components/UI/OptionsButton'
import { loc } from '~/constants'
import { service } from '~/constants'
import { history } from '~/utils/history'
import { createHref } from '~/api'

const ActionsPanelMobileServiceBtnView: React.SFC<IActionsPanelMobileServiceBtnViewComponent.Props> = (props) => {
  const { blockName, list, active, unmount, mount } = props
  const linkHome = () => history.push('', { path: '' })
  const options: IUIOptionsButtonComponent.Option[] = [
    { type: 'cancel', label: loc.LABEL_CLOSE },
    { type: 'separator', label: '' }
  ]
  Object.keys(list).forEach((name) => {
    const href = createHref('', name)
    const action = active !== name ? () => history.push(href, { path: href }) : undefined
    options.push({ type: 'radio', label: service[name], checked: (active === name), action })
  })
  options.push({ type: 'separator', label: '', close: false })
  options.push({ type: 'link', label: loc.SERVICE_UNMOUNT, action: unmount })
  options.push({ type: 'link', label: loc.SERVICE_REMOUNT, action: mount })
  options.push({ type: 'separator', label: '', close: false })
  options.push({ type: 'link', label: loc.LABEL_QUIT_TO_MAIN, action: linkHome })
  return (
    <UIOptionsButton className={ blockName } options={ options }>
      { loc.M_ACTION_PANEL_SERVICE_BUTTON }
    </UIOptionsButton>
  )
}

export default ActionsPanelMobileServiceBtnView
