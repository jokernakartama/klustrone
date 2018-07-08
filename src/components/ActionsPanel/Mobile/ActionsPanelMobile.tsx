import React from 'react'
import ActionsPanelMobileView from './View'
import { dispatch as storeDispatch } from '~/store'
import { appPrompt, appConfirm, appInfo } from '~/ducks/modal'
import { loc } from '~/constants'
import bytesToString from '~/utils/bytesToString'
import { RESOURCE_TYPE_DIR_NAME } from '~/api'
import copyToClipboard from '~/utils/copyToClipboard'

class ActionsPanelMobile extends React.PureComponent<IActionsPanelMobileComponent.Props> {
  constructor (props) {
    super(props)
    this.dialogPurge = this.dialogPurge.bind(this)
    this.dialogRemove = this.dialogRemove.bind(this)
    this.dialogMakeDir = this.dialogMakeDir.bind(this)
    this.dialogRename = this.dialogRename.bind(this)
    this.dialogInfo = this.dialogInfo.bind(this)
    this.copyLink = this.copyLink.bind(this)
  }

  public render () {
    const {
      buffer,
      info,
      download,
      isTrash,
      update,
      paste,
      restore,
      cut,
      copy,
      publish,
      unpublish
    } = this.props
    const props = {
      getInfo: this.dialogInfo,
      isPublished: (info !== null && info.publicLink !== null),
      hasBuffer: (buffer.path !== null),
      isDownloadable: (info !== null && info.type !== RESOURCE_TYPE_DIR_NAME),
      hasSelection: (info !== null),
      isTrash,
      update,
      makeDir: this.dialogMakeDir,
      purge: this.dialogPurge,
      restore,
      paste,
      copy,
      cut,
      rename: this.dialogRename,
      publish,
      copyLink: this.copyLink,
      unpublish,
      remove: this.dialogRemove,
      download
    }
    return (
      <ActionsPanelMobileView { ...props } />
    )
  }
  private dialogMakeDir (): void {
    const { makeDir } = this.props
    appPrompt(storeDispatch)(loc.DIALOG_NEW_DIR, '' )
      .then((name) => {
        makeDir(name)
      })
  }
  private dialogRename (): void {
    const { rename, info } = this.props
    const resName = info !== null ? info.name : ''
    appPrompt(storeDispatch)(loc.DIALOG_NEW_NAME, resName)
      .then((name) => {
        rename(name)
      })
  }
  private dialogPurge (): void {
    const { purge } = this.props
    appConfirm(storeDispatch)(loc.DIALOG_CONFIRM_PURGE)
      .then(() => {
        purge()
      })
  }
  private dialogRemove (): void {
    const { remove } = this.props
    appConfirm(storeDispatch)(loc.DIALOG_CONFIRM_REMOVE)
      .then(() => {
        remove()
      })
  }
  private dialogInfo (): void {
    const { info } = this.props
    if (info !== null) {
      const name = info.name
      const date = info.modified
      const publicLabel = info.publicLink ? loc.LABEL_PUBLISHED : loc.LABEL_UNPUBLISHED
      const size = info.size
      let mess = `${loc.LABEL_NAME}: ${name} \n`
      if (size) mess = mess + `${loc.LABEL_SIZE}: ${bytesToString(size)} \n`
      if (date) mess = mess + `${loc.LABEL_DATE_MODIFIED}: ${date} \n`
      mess = mess + publicLabel
      appInfo(storeDispatch)(mess, { decline: loc.LABEL_OK })
    }
  }
  private copyLink (): void {
    const { info } = this.props
    if (info !== null && info.publicLink) {
      copyToClipboard(info.publicLink)
    }
  }
}

export default ActionsPanelMobile
