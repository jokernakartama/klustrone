import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as serviceListActions from '~/ducks/serviceList'
import ServiceElement from '~/containers/ServiceElement'

interface IServiceListContainerProps {
  serviceListActions: any
  active: string|null
  list: IServiceListState
}

class ServiceList extends React.Component<IServiceListContainerProps> {

  constructor (props) {
    super(props)
    this.connectService = this.connectService.bind(this)
    this.disconnectService = this.disconnectService.bind(this)
    this.addService = this.addService.bind(this)
  }

  public connectService (service: string): void {
    const { connectService } = this.props.serviceListActions
    connectService(service)
  }

  public disconnectService (service: string): void {
    const { disconnectService } = this.props.serviceListActions
    disconnectService(service)
  }

  public addService (service: string): void {
    const { addService } = this.props.serviceListActions
    addService(service)
  }

  public render () {
    const { active, list } = this.props
    const services = Object.keys(list)
      .map((name, index) => {
        const $add = () => this.addService(name)
        const $connect = () => this.connectService(name)
        const $disconnect = () => this.disconnectService(name)
        return (
          <ServiceElement
            name={ name }
            key={ index }
            isActive={ name === active }
            isMounted={ list[name].mounted }
            connect={ $connect }
            disconnect={ $disconnect }
            add={ $add }
          />
        )
      })
    return services
  }
}

function mapStateToProps (state) {
  return {
    active: state.services.active,
    list: state.services.list
  }
}

function mapDispatchToProps (dispatch) {
  return {
    serviceListActions: bindActionCreators(serviceListActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceList)
