import './styles/ServicePanelMobileView.styl'
import React from 'react'
import UIIcon from '~/components/UI/Icon'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'mobile-service-panel'

const ServicePanelMobileView: React.SFC<IServicePanelMobileViewComponent.Props> = (props) => {
  const {
    active,
    list,
    percents,
    isActiveMounted,
    isActiveUnmounted
  } = props

  const blockClass = bem([{ block: BLOCK_NAME }, { block: 'hide-on-desktop' }])
  const serviceWrapperClass =  bem({ block: BLOCK_NAME, elem: 'services-wrapper' })
  const percentsWrapperClass = bem({ block: BLOCK_NAME, elem: 'percents-wrapper' })
  const mountFlagWrapperClass = bem({ block: BLOCK_NAME, elem: 'mounts-wrapper' })
  const percentsValueClass = bem({ block: BLOCK_NAME, elem: 'percents', mod: { active: percents !== null } })
  const percsIconClass = bem({ block: BLOCK_NAME, elem: 'icon', mod: { type: 'percent', active: percents !== null } })
  const mountedIconClass  = bem({ block: BLOCK_NAME, elem: 'icon', mod: { type: 'connect', active: isActiveMounted } })
  const unmountedIconClass = bem({ block: BLOCK_NAME, elem: 'icon', mod: { type: 'disconnect', active: isActiveUnmounted } })

  const availableServices = Object.keys(list).map((name, i) => {
    const className = bem({ block: BLOCK_NAME, elem: 'icon', mod: { type: name, active: name === active } })
    return <UIIcon key={ i } icon={ name } className={ className } />
  })

  return (
    <div className={ blockClass }>
      <div className={ serviceWrapperClass }>
        { availableServices }
      </div>
      <div className={ percentsWrapperClass }>
        <span className={ percentsValueClass }>
          { percents }
        </span>
        <UIIcon icon='percent' className={ percsIconClass } />
      </div>
      <div className={ mountFlagWrapperClass }>
        <UIIcon icon='connect' className={ mountedIconClass } />
        <UIIcon icon='disconnect' className={ unmountedIconClass } />
      </div>
    </div>
  )
}

export default ServicePanelMobileView
