import React from 'react'
import { connect } from 'react-redux'
import ResourceInfoView from './View'

class ResourceInfo extends React.PureComponent<IResourceInfoComponent.Props> {
  constructor (props) {
    super(props)
  }

  public render () {
    const { loading, isTrash, selected, dir, list } = this.props
    const hasSelection = selected !== null
    let info
    if (hasSelection && list !== null && list[selected]) {
      info = list[selected]
    } else {
      info = dir
    }
    return (
      <ResourceInfoView
        loading={ loading }
        isTrash={ isTrash }
        info={ info }
        hasSelection={ hasSelection }
      />
    )
  }
}

function mapStateToProps (state) {
  return {
    loading: state.loading,
    dir: state.resources.dir,
    list: state.resources.list,
    selected: state.resources.selected,
    isTrash: state.active.isTrash
  }
}

export default connect(mapStateToProps)(ResourceInfo)
