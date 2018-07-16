import './styles/NotFoundView.styl'
import React from 'react'
import { Link } from 'react-router-dom'
import { loc } from '~/constants'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'not-found'

const NotFoundView: React.SFC<INotFoundComponentView.Props> = () => {
  const blockClass = bem({ block: BLOCK_NAME })
  const messageClass = bem({ block: BLOCK_NAME, elem: 'message' })
  const buttonClass = bem([{ block: BLOCK_NAME, elem: 'button' }, { block: 'button'}])
  return (
    <div className={ blockClass }>
      <p className={ messageClass }>{ loc.DIALOG_NOT_FOUND }</p>
      <Link to='/' className={ buttonClass }>{ loc.LINK_LABEL_HOME }</Link>
    </div>
  )
}

export default NotFoundView
