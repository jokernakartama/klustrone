import './styles/FileManagerUnmountedView.styl'
import React from 'react'
import { Link } from 'react-router-dom'
import { loc } from '~/constants'
import UIIcon from '~/components/UI/Icon'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'service-special-message'

const FileManagerUnmountedView: React.SFC<IFileManagerUnmountedViewComponent.Props> = (props) => {
  const iconClass = bem({ block: BLOCK_NAME, elem: 'icon' })
  const messageClass = bem({ block: BLOCK_NAME, elem: 'message' })
  const btnWrapperClass = bem({ block: BLOCK_NAME, elem: 'buttons' })
  const buttonClass = bem([{ block: BLOCK_NAME, elem: 'button' }, { block: 'button' }])
  return (
    <div className={ BLOCK_NAME }>
      <div className={ messageClass }>
        <UIIcon icon='unmounted' className={ iconClass } />
        { loc.DIALOG_SERVICE_UNMOUNTED }
      </div>
      <div className={ btnWrapperClass }>
        <Link to='/' className={ buttonClass }>{ loc.M_NAVI_HOME }</Link>
        <button className={ buttonClass } onClick={ props.action }>{ loc.SERVICE_MOUNT }</button>
      </div>
    </div>
  )
}

export default FileManagerUnmountedView
