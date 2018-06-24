import './styles/FileManagerView.styl'
import React from 'react'
import bem from '~/utils/bemName'

const FileManagerView: React.SFC<IFileManagerViewComponent.Props> = ({ children }) => {
  const blockClass = bem({
    block: 'file-manager'
  })
  return <div className={ blockClass }> { children } </div>
}

export default FileManagerView
