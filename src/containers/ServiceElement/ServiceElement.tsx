import React from 'react'
import ServiceElementView from '~/components/ServiceElementView'

interface IServiceElementContainerProps {
  name: string
  isActive: boolean
  isMounted: boolean
  connect: () => void
  disconnect: () => void
  add: () => void
}

class ServiceElement extends React.PureComponent<IServiceElementContainerProps> {
  public componentDidUpdate (prevProps) {
    const prevState: boolean = prevProps.isMounted
    const currentState: boolean = this.props.isMounted
    if (prevState !== currentState) {
      if (currentState === true) {
        this.props.connect()
      } else if (currentState === false) {
        this.props.disconnect()
      }
    }
  }

  public render () {
    const { name, isActive, isMounted, disconnect, add } = this.props
    return (
      <ServiceElementView
        name={ name }
        isActive={ isActive }
        isMounted={ isMounted }
        disconnect={ disconnect }
        add={ add }
      />
    )
  }
}

export default ServiceElement
