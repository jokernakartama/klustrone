import './styles/FileManagerUpdatedView.styl'
import React from 'react'
import { loc } from '~/constants'
import UIIcon from '~/components/UI/Icon'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'service-special-message'

const FileManagerUpdatedView: React.SFC<IFileManagerUpdatedViewComponent.Props> = (props) => {
  const iconClass = bem({ block: BLOCK_NAME, elem: 'icon' })
  const wrapperClass = bem({ block: BLOCK_NAME, elem: 'wrapper' })
  const buttonClass = bem([{ block: BLOCK_NAME, elem: 'button' }, { block: 'button' }])
  return (
    <div className={ BLOCK_NAME }>
      <div className={ wrapperClass }>
        <UIIcon icon='mounted' className={ iconClass } />
        { loc.DIALOG_SERVICE_UPDATED }
        <button className={ buttonClass } onClick={ props.action }>{ loc.DIALOG_CONFIRM }</button>
      </div>
    </div>
  )
}

export default FileManagerUpdatedView
