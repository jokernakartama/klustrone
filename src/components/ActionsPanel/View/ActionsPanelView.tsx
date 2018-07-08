import './styles/ActionsPanelView.styl'
import React from 'react'
import bem from '~/utils/bemName'
import ActionsPanelMobile from '../Mobile'

const BLOCK_NAME = 'actions-panel'

const ActionsPanelView: React.SFC<IActionsPanelViewComponent.Props> = (props) => {
  const blockClass = bem({ block: BLOCK_NAME })
  return (
    <div className={ blockClass }>
      <ActionsPanelMobile { ...props } />
    </div>
  )
}

export default ActionsPanelView
