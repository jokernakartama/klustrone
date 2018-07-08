import React from 'react'

export = IActionsPanelMobileActionBtnViewComponent
export as namespace IActionsPanelMobileActionBtnViewComponent

declare namespace IActionsPanelMobileActionBtnViewComponent {
  interface Props {
    getInfo: () => void
    isPublished: boolean
    hasBuffer: boolean
    hasSelection: boolean
    isDownloadable: boolean
    isTrash: boolean
    update: () => void
    makeDir: () => void
    purge: () => void
    restore: () => void
    paste: () => void
    copy: () => void
    cut: () => void
    rename: () => void
    publish: () => void
    copyLink: () => void
    unpublish: () => void
    remove: () => void
    download: () => void
    blockName: string
  }
}
