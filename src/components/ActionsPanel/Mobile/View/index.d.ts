export = IActionsPanelMobileViewComponent
export as namespace IActionsPanelMobileViewComponent

declare namespace IActionsPanelMobileViewComponent {
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
  }
}
