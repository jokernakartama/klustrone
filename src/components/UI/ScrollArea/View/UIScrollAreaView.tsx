import './styles/UIScrollAreaView.styl'
import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import bem from '~/utils/bemName'

const UIScrollAreaView: React.SFC<IUIScrollAreaViewComponent.Props> = ({ domRef, style, className, children }) => {
  const blockName = 'scroll-area'
  const scrollAreaClassNames: IBEMEntityObject[] = [
    { block: blockName }
  ]
  if (className) scrollAreaClassNames.push({ block: className })
  const wrapperClass = bem({ block: blockName + '-wrapper' })
  const contentClass = bem({ block: blockName, elem: 'content'})
  const trackHClass = bem({ block: blockName, elem: 'track', mod: { position: 'horizontal' } })
  const trackVClass = bem({ block: blockName, elem: 'track', mod: { position: 'vertical' } })
  const thumbHClass = bem({ block: blockName, elem: 'thumb', mod: { position: 'horizontal' } })
  const thumbVClass = bem({ block: blockName, elem: 'thumb', mod: { position: 'vertical' } })

  const scrollArea = (props) => <div {...props} className={ bem(scrollAreaClassNames) } />
  const scrollAreaTrackHorizontal = (props) => <div {...props} className={ trackHClass } />
  const scrollAreaTrackVertical = (props) => <div {...props} className={ trackVClass } />
  const scrollAreaThumbHorizontal = (props) => <div {...props} className={ thumbHClass } />
  const scrollAreaThumbVertical = (props) => <div {...props} className={ thumbVClass } />

  const defaults = {
    autoHide: true,
    className: wrapperClass,
    autoHeight: true,
    autoHeightMin: 0,
    autoHeightMax: 'unset',
    renderView: scrollArea,
    thumbMinSize: 30,
    renderTrackHorizontal: (props) => scrollAreaTrackHorizontal(props),
    renderTrackVertical: (props) => scrollAreaTrackVertical(props),
    renderThumbHorizontal: (props) => scrollAreaThumbHorizontal(props),
    renderThumbVertical: (props) => scrollAreaThumbVertical(props)
  }

  return (
    <Scrollbars ref={ domRef } { ...defaults } style={ {...style, height: '100%' } }>
      <div className={ contentClass }>{ children }</div>
    </Scrollbars>
  )
}

export default UIScrollAreaView
