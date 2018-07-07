import './styles/ServicePanelView.styl'
import React from 'react'
import ServicePanelMobile from '../Mobile'
import ServicePanelDesktop from '../Desktop'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'service-panel'

const ServicePanelView: React.SFC<IServicePanelViewComponent.Props> = (props) => {
  const blockClass = bem({ block: BLOCK_NAME })
  const { active, list, mount, unmount } = props
  return (
    <div className={ blockClass }>
      <ServicePanelMobile
        active={ active }
        list={ list }
        unmount={ unmount }
        mount={ mount }
      />
      <ServicePanelDesktop
        active={ active }
        list={ list }
        mount={ mount }
        unmount={ unmount }
      />
    </div>
  )
}

export default ServicePanelView
