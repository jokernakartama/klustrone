import './styles/resourceListView.styl'
import React from 'react'
import ScrollArea from '~/components/ScrollArea'
import bem from '~/utils/bemName'

interface IResourceListViewComponentProps {
  children?: React.ReactNode
}

const ResourceListView: React.SFC<IResourceListViewComponentProps> = (props) => {
  const blockName = 'resource-list'
  const wrapperClassName = bem({ block: blockName + '-wrapper' })
  return (
    <div className={ wrapperClassName }>
      <ScrollArea className={ blockName }>
        { props.children }
      </ScrollArea>
    </div>
  )
}

export default ResourceListView
