import React from 'react'
import ServicePanelDesktopView from './View'

class ServicePanelDesktop extends React.PureComponent<IServicePanelDesktopComponent.Props, IServicePanelDesktopComponent.State> {
  public state = {
    visible: false,
    selected: null
  }
  constructor (props) {
    super(props)
    this.pullTheBlanket = this.pullTheBlanket.bind(this)
    this.toggleView = this.toggleView.bind(this)
  }

  public render () {
    const { active, list, mount, unmount } = this.props
    const { visible, selected } = this.state
    return (
      <ServicePanelDesktopView
        visible={ visible }
        selected={ selected }
        active={ active }
        list={ list }
        toggle={ this.toggleView }
        pull={ this.pullTheBlanket }
        unmount={ unmount }
        mount={ mount }
      />
    )
  }

  private toggleView (): void {
    this.setState({
      visible: !this.state.visible
    })
  }

  private pullTheBlanket (service: string|null): void {
    const prevService = this.state.selected
    // deselect if service was selected twice
    if (service === prevService) {
      this.setState({
        selected: null
      })
    } else {
      this.setState({
        selected: service
      })
    }
  }
}

export default ServicePanelDesktop
