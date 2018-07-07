import './styles/ServicePanelDesktopView.styl'
import React from 'react'
import ServicePanelDesktopItem from '../Item'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'desktop-service-panel'

const ServicePanelDesktopView: React.SFC<IServicePanelDesktopViewComponent.Props> = (props) => {
  const {
    list,
    active,
    selected,
    pull,
    unmount,
    mount
  } = props
  const services = list || {}
  const blockClass = bem([{ block: BLOCK_NAME }, { block: 'hide-on-mobile'}])
  const items = Object.keys(services).map((item, index) => {
    const service = list[item]
    const $pull = () => pull(service.name)
    const $mount = () => mount(service.name)
    const $unmount = () => unmount(service.name)
    return (
      <ServicePanelDesktopItem
        key={ index }
        name={ service.name }
        isActive={ service.name === active }
        isSelected={ service.name === selected }
        isMounted={ service.mounted }
        pull={ $pull }
        mount={ $mount }
        unmount={ $unmount }
      />
    )
  })
  return (
    <div className={ blockClass }>
    { items }
    </div>
  )
}

export default ServicePanelDesktopView
