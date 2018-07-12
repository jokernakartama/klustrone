import './styles/ResourceInfoView.styl'
import React from 'react'
import bem from '~/utils/bemName'
import bytesToString from '~/utils/bytesToString'
import { TRASH_URL_IDENTIFIER } from '~/api'
import { loc } from '~/constants'

const BLOCK_NAME = 'mobile-resource-info'

const ResourceInfoView: React.SFC<IResourceInfoViewComponent.Props> = (props) => {
  const blockClass = bem([{ block: BLOCK_NAME }, { block: 'hide-on-desktop' }])
  const sizeClass = bem({ block: BLOCK_NAME, elem: 'size' })
  const descClass = bem({ block: BLOCK_NAME, elem: 'description' })
  const { isTrash, hasSelection, info } = props
  let content = ''
  if (hasSelection && info !== null) content = `${loc.M_RESOURCE_INFO_SELECTED}: ${info.name}`
  if (!hasSelection && info !== null) {
    content = `
      ${loc.M_RESOURCE_INFO_DIRECTORY}: ${info.name}${isTrash ? TRASH_URL_IDENTIFIER : ''}
    `
  }
  return (
    <div className={ blockClass }>
      <span className={ descClass }>{ content }</span>
      { info !== null && info.size &&
        <span className={ sizeClass }>{ bytesToString(info.size) }</span>
      }
    </div>
  )
}

export default ResourceInfoView
