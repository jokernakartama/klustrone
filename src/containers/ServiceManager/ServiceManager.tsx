import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as serviceListActions from '~/ducks/serviceList'
import ServiceManagerView from '~/components/ServiceManagerView'
import { serviceMap } from '~/api'

interface IServiceManagerContainerProps {
  children?: React.ReactNode
  serviceListActions: any
  active: IServiceListElementState|null
}

interface IServiceManagerContainerState {
  childrenVisible: boolean
}

/**
 * This component sets services' mounted status
 * @extends React.PureComponent
 */

class ServiceManager extends React.PureComponent<IServiceManagerContainerProps, IServiceManagerContainerState> {
  public state = {
    childrenVisible: false
  }

  constructor (props) {
    super(props)
    const { connectService } = props.serviceListActions
    this.toggleChildrenVisibility = this.toggleChildrenVisibility.bind(this)
    // It is pretty important to set the initial state of services
    // as soon as possible to avoid additional rendering of other components
    for (const service in serviceMap) {
      if (serviceMap[service].saveTokenData) {
        connectService(service)
      }
    }
  }

  public toggleChildrenVisibility () {
    this.setState({
      childrenVisible: !this.state.childrenVisible
    })
  }

  public render () {
    const { active, children } = this.props
    const { addService, disconnectService } = this.props.serviceListActions
    const { childrenVisible } = this.state
    const mount = () => addService(active.name)
    const unmount = () => disconnectService(active.name)
    return (
      <ServiceManagerView
        active={ active }
        mount={ mount }
        unmount={ unmount }
        visible={ childrenVisible }
        toggle={ this.toggleChildrenVisibility }
      >
        { children }
      </ServiceManagerView>
    )
  }
}

function mapStateToProps (state) {
  return {
    active: state.services.list[state.services.active] || null
  }
}

function mapDispatchToProps (dispatch) {
  return {
    serviceListActions: bindActionCreators(serviceListActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceManager)
