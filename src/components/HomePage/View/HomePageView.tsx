import './styles/HomePageView.styl'
import React from 'react'
import { Link } from 'react-router-dom'
import { serviceMap, createHref } from '~/api'
import bem from '~/utils/bemName'
import { loc, service } from '~/constants'
import UIScrollArea from '~/components/UI/ScrollArea'
import UIIcon from '~/components/UI/Icon'

const BLOCK_NAME = 'homepage'

const HomePageView: React.SFC<IHomePageViewComponent.Props> = () => {
  const blockClass = bem({ block: BLOCK_NAME })
  const scrollClass = bem({ block: BLOCK_NAME, elem: 'scroll-area' })
  const servicesWrapperClass = bem({ block: BLOCK_NAME, elem: 'services-wrapper' })
  const linksWrapperClass = bem({ block: BLOCK_NAME, elem: 'links-wrapper' })
  const iconClass = bem({ block: BLOCK_NAME, elem: 'icon' })
  const linkClass = bem({ block: BLOCK_NAME, elem: 'link' })

  const services = Object.keys(serviceMap).map((name, i) => {
    const className = bem({ block: BLOCK_NAME, elem: 'link', mod: { type: name } })
    const href = createHref('', name)
    return (
      <Link key={ i } className={ className } to={ href }>
        <UIIcon className={ iconClass } icon={ name } />
        { service[name] }
      </Link>
    )
  })
  return (
      <div className={ blockClass }>
        <UIScrollArea className={ scrollClass }>
          <div className={ servicesWrapperClass }>
            { services }
          </div>
          <div className={ linksWrapperClass }>
          <Link className={ linkClass } to={ '/about' }>
            <UIIcon className={ iconClass } icon={ 'about' } />
            { loc.LINK_LABEL_ABOUT }
          </Link>
          </div>
        </UIScrollArea>
      </div>
  )
}

export default HomePageView
