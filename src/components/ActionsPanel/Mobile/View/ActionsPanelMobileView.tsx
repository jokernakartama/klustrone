import './styles/ActionsPanelMobileView.styl'
import React from 'react'
import ActionsPanelMobileServiceBtn from '../ServiceBtn'
import ActionsPanelMobileSortBtn from '../SortBtn'
import ActionsPanelMobileViewBtn from '../ViewBtn'
import ActionsPanelMobileActionBtn from '../ActionBtn'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'mobile-actions-panel'

const ActionsPanelMobileView: React.SFC<IActionsPanelMobileViewComponent.Props> = (props) => {
  const blockClass = bem([{ block: BLOCK_NAME }, { block: 'hide-on-desktop' }])
  const buttonClass = bem({ block: BLOCK_NAME, elem: 'button' })
  return (
    <div className={ blockClass }>
      <ActionsPanelMobileServiceBtn blockName={ buttonClass } />
      <ActionsPanelMobileSortBtn blockName={ buttonClass } />
      <ActionsPanelMobileViewBtn blockName={ buttonClass } />
      <ActionsPanelMobileActionBtn
        blockName={ buttonClass }
        { ...props }
      />
    </div>
  )
}

export default ActionsPanelMobileView
