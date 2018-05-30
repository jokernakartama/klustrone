import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as sortActions from '~/ducks/sort'

interface ISortActionsContainerProps {
  children?: React.ReactNode
  field: string
  asc: boolean
  sortActions: any
}

class SortActions extends React.PureComponent<ISortActionsContainerProps> {
  constructor (props) {
    super(props)
    this.changeSort = this.changeSort.bind(this)
    this.toggleDirection = this.toggleDirection.bind(this)
  }

  public render () {
    const { children, field, asc } = this.props
    const props = {
      field,
      asc,
      toggleDirection: this.toggleDirection,
      changeSort: this.changeSort
    }
    const content = React.isValidElement(children) ? React.cloneElement(children, props) : children || null
    return content
  }
  private toggleDirection (): void  {
    const { asc, field } = this.props
    const { sortResourcesList } = this.props.sortActions
    sortResourcesList(field, !asc)
  }
  private changeSort (nextField: string, nextAsc?: boolean): void {
    const { asc } = this.props
    const { sortResourcesList } = this.props.sortActions
    const newAsc = nextAsc === true || nextAsc === false ? nextAsc : asc
    sortResourcesList(nextField, newAsc)
  }
}

function mapStateToProps (state) {
  return {
    field: state.sort.field,
    asc: state.sort.asc
  }
}

function mapDispatchToProps (dispatch) {
  return {
    sortActions: bindActionCreators(sortActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SortActions)
