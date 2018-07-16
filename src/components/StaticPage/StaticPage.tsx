import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as loadingActions from '~/ducks/loading'
import AX from '~/utils/ajax'
import StaticPageView from './View'
import NotFound from '~/components/NotFound'

const STATIC_PAGES_DIR = '/static/klustr/pages/'
const PAGES_EXTENSION = '.md'

class StaticPage extends React.PureComponent<IStaticPageComponent.Props, IStaticPageComponent.State> {
  public state = {
    content: ''
  }

  constructor (props) {
    super(props)
  }

  public componentDidMount () {
    const { loadingStart, loadingEnd } = this.props.loadingActions
    loadingStart()
    AX.get(STATIC_PAGES_DIR + this.props.pageName + PAGES_EXTENSION)
      .status({
        success: [200, 302],
        error: 404,
        anyway: 'all'
      })
      .on('success', (body) => {
        this.setState({
          content: body
        })
      })
      .on('error', () => {
        this.setState({
          content: null
        })
      })
      .on('anyway', () => {
        loadingEnd()
      })
      .send()
  }
  public render () {
    const { content } = this.state
    if (content === null) {
      return <NotFound />
    }
    return (
      <StaticPageView content={ content } />
    )
  }
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    loadingActions: bindActionCreators(loadingActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StaticPage)
