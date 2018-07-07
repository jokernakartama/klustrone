import './styles/ResourceListView.styl'
import React from 'react'
import UIScrollArea from '~/components/UI/ScrollArea'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'resource-list'

const ResourceListView: React.SFC<IResourceListViewComponent.Props> = ({ view, children}) => {
  const blockName = bem({ block: BLOCK_NAME, mod: { view } })
  const wrapperClass = bem({ block: BLOCK_NAME + '-wrapper' })
  return (
    <div className={ wrapperClass }>
      <UIScrollArea className={ blockName }>
        { children }
      </UIScrollArea>
    </div>
  )
}

export default ResourceListView
