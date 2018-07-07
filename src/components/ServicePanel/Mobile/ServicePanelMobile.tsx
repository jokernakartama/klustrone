import React from 'react'
import ServicePanelMobileView from './View'

const ServicePanelMobile: React.SFC<IServicePanelMobileComponent.Props> = (props) => {
  const {
    active,
    list,
  } = props
  const isActiveMounted = active !== null && list[active] && list[active].mounted
  const isActiveUnmounted = active !== null && list[active] && !list[active].mounted
  const percents = isActiveMounted && list[active].expiresPerc ? list[active].expiresPerc : null
  return (
    <ServicePanelMobileView
      active={ active }
      list={ list }
      percents={ percents }
      isActiveMounted={ isActiveMounted }
      isActiveUnmounted={ isActiveUnmounted }
    />
  )
}

export default ServicePanelMobile
