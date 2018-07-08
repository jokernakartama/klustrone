import { viewType } from '~/ducks/view/view'
export = IActionsPanelViewComponent
export as namespace IActionsPanelViewComponent

declare namespace IActionsPanelViewComponent {
  interface Props {
    isTrash: boolean
    info: IResourceData|null
    buffer: IResourceBufferActionPayload
    update: () => void
    makeDir: (dirName: string) => void
    purge: () => void
    restore: () => void
    paste: () => void
    copy: () => void
    cut: () => void
    rename: (newName: string) => void
    publish: () => void
    unpublish: () => void
    remove: () => void
    download: () => void
  }
}
