import './styles/ServicePanelDesktopItemView.styl'
import React from 'react'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'service-control'

const ServicePanelDesktopItem: React.SFC<IServicePanelDesktopItemViewComponent.Props> = (props) => {
  const blockClass = bem({ block: BLOCK_NAME })
  const {
    name,
    isMounted,
    unmount,
    mount
  } = props
  return (
    <div className={ blockClass }>
      { name } <button onClick={ isMounted ? unmount : mount }>...</button>
    </div>
  )
}

export default ServicePanelDesktopItem
