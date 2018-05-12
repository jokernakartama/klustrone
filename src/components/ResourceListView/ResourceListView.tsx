import './styles/resourceListView.styl'
import React from 'react'
import ScrollArea from '~/components/ScrollArea'

interface IResourceListViewComponentProps {
  children?: React.ReactNode
}

const ResourceListView: React.SFC<IResourceListViewComponentProps> = (props) => {
  const blockName = 'resource-list'
  return (
    <div className={ blockName + '-wrapper' }>
      <ScrollArea className={ blockName }>
        { props.children }
      </ScrollArea>
    </div>
  )
}

export default ResourceListView
