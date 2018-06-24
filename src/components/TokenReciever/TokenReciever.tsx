import React from 'react'
import { CloudAPI } from '~/api'
import TokenRecieverView from './View'

const TokenReciever: React.SFC = () => {
  const error = !CloudAPI.postCode()
  return <TokenRecieverView error={ error } />
}

export default TokenReciever
