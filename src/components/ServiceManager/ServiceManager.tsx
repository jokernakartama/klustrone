import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as serviceListActions from '~/ducks/serviceList'
import { serviceMap } from '~/api'

/**
 * This component sets services' mounted status
 * @extends React.PureComponent
 */

class ServiceManager extends React.PureComponent<IServiceManagerComponent.Props> {
  constructor (props) {
    super(props)
    const { connectService } = props.serviceListActions
    // It is pretty important to set the initial state of services
    // as soon as possible to avoid additional rendering of other components
    for (const service in serviceMap) {
      if (serviceMap[service].saveTokenData) {
        connectService(service)
      }
    }
  }

  public componentDidUpdate (prevProps) {
    const { connectService, disconnectService } = this.props.serviceListActions
    const prevList = prevProps.list
    const nextList = this.props.list
    // When a service recieves a new "mounted" value
    // from crosstab event it should save/delete its token.
    // This behavior is unlike manual connection, when "mounted"
    // status is set after saving/deleting the token.
    Object.keys(nextList).forEach((service: string) => {
      const prevState: boolean = prevList[service].mounted
      const currentState: boolean = nextList[service].mounted
      if (prevState !== currentState) {
        if (currentState === true) {
          connectService(service)
        } else if (currentState === false) {
          disconnectService(service)
        }
      }
    })
  }

  public render () {
    return this.props.children || null
  }
}

function mapStateToProps (state) {
  return {
    list: state.services
  }
}

function mapDispatchToProps (dispatch) {
  return {
    serviceListActions: bindActionCreators(serviceListActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceManager)
