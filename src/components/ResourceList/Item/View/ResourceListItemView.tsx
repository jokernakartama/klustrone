import './styles/ResourceListItemView.styl'
import React from 'react'
import bem from '~/utils/bemName'
import bytesToString from '~/utils/bytesToString'
import { RESOURCE_TYPE_DIR_NAME, RESOURCE_TYPE_ROOT_NAME, RESOURCE_TYPE_TRASH_NAME } from '~/api'
import UIIcon from '~/components/UI/Icon'

const ResourceListItemView: React.SFC<IResourceListItemViewComponent.Props> = (props) => {
  const {
    name,
    view,
    id,
    href,
    path,
    preview,
    type,
    size,
    isPublic,
    isSelected,
    onClickHandler,
    onDoubleClickHandler,
    onDragStartHandler
  } = props

  const blockName = 'resource'

  const tagClassName = bem([
    {
      block: 'resource-list',
      elem: 'item',
      mod: { view }
    },
    {
      block: blockName,
      mod: {
        selected: isSelected,
        view,
        type,
        public: isPublic
      }
    }
  ])
  const iconClass = bem({ block: blockName, elem: 'icon', mod: { type } })
  const publicClass = bem({ block: blockName, elem: 'publicity-icon' })
  const previewClass = bem({ block: blockName, elem: 'preview' })
  const titleClass = bem({ block: blockName, elem: 'title' })
  const sizeClass = bem({ block: blockName, elem: 'size' })
  const isShouldBeALink = type === RESOURCE_TYPE_DIR_NAME ||
  type === RESOURCE_TYPE_ROOT_NAME || type === RESOURCE_TYPE_TRASH_NAME
  const link = isShouldBeALink ? { href } : {}
  const TagName = isShouldBeALink ? 'a' : 'div'

  return (
    <TagName
      draggable={ false }
      { ...link}
      className={ tagClassName }
      id={ id }
      data-path={ path }
      onDragStart={ onDragStartHandler }
      onClick={ onClickHandler }
      onDoubleClick={ onDoubleClickHandler }
    >
      <UIIcon className={ iconClass } icon={ 'res-' + type }>
        { preview && <div className={ previewClass } style={ { backgroundImage: 'url(' + preview + ')' } } /> }
      </UIIcon>
      { isPublic &&
        <UIIcon className={ publicClass } icon={ 'published' } />
      }
      <div className={ titleClass }>{ name }</div>
      { size !== undefined &&
        <div className={ sizeClass }>{ bytesToString(size as number) }</div>
      }
    </TagName>
  )
}

export default ResourceListItemView
