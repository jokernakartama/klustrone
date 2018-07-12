import './styles/LoadingSpinnerView.styl'
import React from 'react'
import bem from '~/utils/bemName'
import { loc } from '~/constants'

const BLOCK_NAME = 'loading-spinner'

const LoadingSpinnerView: React.SFC<ILoadingSpinnerViewComponent.Props> = ({ loading }) => {
  const blockClass = bem([{ block: 'overlay' }, { block: BLOCK_NAME + '-wrapper', mod: { active: loading } }])
  const wrapperClass = bem({ block: BLOCK_NAME })
  return (
    <div className={ blockClass }>
      <div className={ wrapperClass }>
        { loc.IS_LOADING }
      </div>
    </div>
  )
}

export default LoadingSpinnerView
