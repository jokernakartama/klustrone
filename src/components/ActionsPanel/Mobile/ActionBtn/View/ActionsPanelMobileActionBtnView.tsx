import './styles/ActionsPanelMobileActionBtnView.styl'
import React from 'react'
import UIOptionsButton from '~/components/UI/OptionsButton'
import { loc } from '~/constants'

const ActionsPanelMobileActionBtnView: React.SFC<IActionsPanelMobileActionBtnViewComponent.Props> = (props) => {
  const {
    getInfo,
    isPublished,
    hasBuffer,
    hasSelection,
    isDownloadable,
    isTrash,
    update,
    makeDir,
    purge,
    restore,
    paste,
    copy,
    cut,
    rename,
    publish,
    copyLink,
    unpublish,
    remove,
    download,
    blockName
  } = props
  const options: IUIOptionsButtonComponent.Option[] = [
    { type: 'cancel', label: loc.LABEL_CLOSE },
    { type: 'separator', label: '', close: false },
    // directory actions start
    { type: 'link', label: loc.ACTION_UPDATE, action: update },
  ]
  if (hasSelection) options.push({ type: 'link', label: loc.ACTION_INFO, action: getInfo })
  if (isTrash) {
    if (hasSelection) options.push({ type: 'link', label: loc.ACTION_RESTORE, action: restore })
    options.push({ type: 'separator', label: '', close: false })
    options.push({ type: 'link', label: loc.ACTION_PURGE, action: purge })
  } else {
    options.push({ type: 'link', label: loc.ACTION_MAKEDIR, action: makeDir })
    // directory actions end
    // buffer actions
    if (hasSelection || hasBuffer) options.push({ type: 'separator', label: '', close: false })
    if (hasBuffer) options.push({ type: 'link', label: loc.ACTION_PASTE, action: paste })
    if (hasSelection) {
      options.push({ type: 'link', label: loc.ACTION_CUT, action: cut })
      options.push({ type: 'link', label: loc.ACTION_COPY, action: copy })
    }
    if (hasSelection) options.push({ type: 'separator', label: '', close: false })
    // resource actions
    if (hasSelection) {
      if (isDownloadable) options.push({ type: 'link', label: loc.ACTION_DOWNLOAD, action: download })
      options.push({ type: 'link', label: loc.ACTION_RENAME, action: rename })
      if (isPublished) {
        options.push({ type: 'checkbox', label: loc.LABEL_PUBLIC, action: unpublish, checked: true, close: false })
      } else {
        options.push({ type: 'checkbox', label: loc.LABEL_PUBLIC, action: publish, checked: false, close: false })
      }
      if (isPublished) options.push({ type: 'link', label: loc.ACTION_COPY_PUBLIC_LINK, action: copyLink })
      options.push({ type: 'link', label: loc.ACTION_REMOVE, action: remove })
    }
  }
  return (
    <UIOptionsButton className={ blockName } options={ options }>
      { loc.M_ACTION_PANEL_ACTIONS_BUTTON }
    </UIOptionsButton>
  )
}

export default ActionsPanelMobileActionBtnView
