import './styles/StaticPageView.styl'
import React from 'react'
import { Link } from 'react-router-dom'
import bem from '~/utils/bemName'
import UIScrollArea from '~/components/UI/ScrollArea'
import SimpleMarkdown from '~/components/SimpleMarkdown'
import { loc } from '~/constants'

const BLOCK_NAME = 'static-page'

class StaticPageView extends React.PureComponent<IStaticPageViewComponent.Props> {
  private scrollarea
  constructor (props) {
    super(props)
    this.scrollarea = React.createRef()
    this.pageDown = this.pageDown.bind(this)
    this.pageUp = this.pageUp.bind(this)
  }

  public render () {
    const { content } = this.props
    const blockClass = bem({ block: BLOCK_NAME })
    const contentClass = bem({ block: BLOCK_NAME, elem: 'content' })
    const scrollClass = bem({ block: BLOCK_NAME, elem: 'scroll-area' })
    const naviPanelClass = bem([{ block: BLOCK_NAME, elem: 'navigation' }, { block: 'hide-on-desktop' }])
    const buttonClass = bem({ block: BLOCK_NAME, elem: 'navi-button' })

    return (
        <div className={ blockClass }>
          <div className={ contentClass }>
            <UIScrollArea className={ scrollClass } domRef={ this.scrollarea }>
              <SimpleMarkdown>
                { content }
              </SimpleMarkdown>
            </UIScrollArea>
          </div>
          <div className={ naviPanelClass }>
            <button className={ buttonClass } onClick={ this.pageUp }>{ loc.M_NAVI_PAGE_UP }</button>
            <Link className={ buttonClass } to='/'>{ loc.M_NAVI_HOME }</Link>
            <button className={ buttonClass } onClick={ this.pageDown }>{ loc.M_NAVI_PAGE_DOWN }</button>
          </div>
        </div>
    )
  }
  private pageDown () {
    const content = this.scrollarea.current
    content.scrollTop(content.getClientHeight() + content.getScrollTop())
  }
  private pageUp () {
    const content = this.scrollarea.current
    content.scrollTop(content.getScrollTop() - content.getClientHeight())
  }
}

export default StaticPageView
