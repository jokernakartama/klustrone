import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as sortActions from '~/ducks/sort'
import ActionsPanelMobileSortBtnView from './View'

const ActionsPanelMobileSortBtn: React.SFC<IActionsPanelMobileSortBtnComponent.Props> = (props) => {
  const { sortResourcesList } = props.sortActions
  const { field, asc, blockName } = props
  return (
    <ActionsPanelMobileSortBtnView
      field={ field }
      asc={ asc }
      change={ sortResourcesList }
      blockName={ blockName }
    />
  )
}

function mapStateToProps (state) {
  return {
    asc: state.sort.asc,
    field: state.sort.field
  }
}

function mapDispatchToProps (dispatch) {
  return {
    sortActions: bindActionCreators(sortActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsPanelMobileSortBtn)
