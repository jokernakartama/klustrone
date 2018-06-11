import './styles/fileManagerView.styl'
import React from 'react'
import FileManagerUpdatedView from '~/components/FileManagerUpdatedView'
import FileManagerUnmountedView from '~/components/FileManagerUnmountedView'
import NotFound from '~/components/NotFound'
import bem from '~/utils/bemName'

interface IFileManagerViewComponentProps {
  children?: React.ReactNode
  serviceStatus: renderStatus
  action?: () => void
}

export enum renderStatus {
  MOUNTED, // when the service is mounted initially
  UNMOUNTED, // when the service is unmounted
  UPDATED, // when the service is mounted recently, but resource list is null
  UNAVAILABLE // when the service does not exist in serviceMap
}

const FileManagerView: React.SFC<IFileManagerViewComponentProps> = (props) => {
  const { children, serviceStatus, action } = props
  const blockClass = bem({
    block: 'file-manager'
  })
  let content
  if (serviceStatus === renderStatus.UPDATED) {
    content = <FileManagerUpdatedView action={ action } />
  } else if (serviceStatus === renderStatus.MOUNTED) {
    content = <div className={ blockClass }> { children } </div>
  } else if (serviceStatus === renderStatus.UNAVAILABLE) {
    content = <NotFound />
  } else if (serviceStatus === renderStatus.UNMOUNTED) {
    content = <FileManagerUnmountedView action={ action } />
  }
  return content
}

export default FileManagerView
