import './styles/TokenRecieverView.styl'
import React from 'react'
import bem from '~/utils/bemName'
import { loc } from '~/constants'

const BLOCK_NAME = 'token-reciever'

const TokenRecieverView: React.SFC<ITokenRecieverViewComponent.Props> = ({ error }) => {
  const blockClass = bem({ block: BLOCK_NAME })
  const errorClass = bem({ block: BLOCK_NAME, elem: 'error' })
  const successClass = bem({ block: BLOCK_NAME, elem: 'success' })
  return (
    <div className={ blockClass }>
      { !error &&
        <div className={ successClass }>{ loc.DIALOG_TOKEN_RECIEVED }</div>
      }
      { error &&
        <div className={ errorClass }>{ loc.DIALOG_TOKEN_NOT_RECIEVED }</div>
      }
    </div>
  )
}

export default TokenRecieverView
