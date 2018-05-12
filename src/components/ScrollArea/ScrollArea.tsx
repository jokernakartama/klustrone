import './styles/scrollArea.styl'
import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import bem from '~/utils/bemName'

interface IScrollAreaComponentProps {
  children?: React.ReactNode
  style?: object
  className?: string
}

const ScrollArea: React.SFC<IScrollAreaComponentProps> = ({ style, className, children }) => {
  const blockName = 'scroll-area'
  const scrollAreaClassNames = [
    { block: blockName }
  ]
  if (className) scrollAreaClassNames.push({ block: className })
  const trackHClassName = { block: blockName, elem: 'track', mod: { position: 'horizontal' }}
  const trackVClassName = { block: blockName, elem: 'track', mod: { position: 'vertical' }}
  const thumbHClassName = { block: blockName, elem: 'thumb', mod: { position: 'horizontal' }}
  const thumbVClassName = { block: blockName, elem: 'thumb', mod: { position: 'vertical' }}

  const scrollArea = (props) => <div {...props} className={ bem(scrollAreaClassNames) } />
  const scrollAreaTrackHorizontal = (props) => <div {...props} className={ bem(trackHClassName) } />
  const scrollAreaTrackVertical = (props) => <div {...props} className={ bem(trackVClassName) } />
  const scrollAreaThumbHorizontal = (props) => <div {...props} className={ bem(thumbHClassName) } />
  const scrollAreaThumbVertical = (props) => <div {...props} className={ bem(thumbVClassName) } />

  const defaults = {
    autoHide: true,
    autoHeight: true,
    renderView: scrollArea,
    thumbMinSize: 30,
    renderTrackHorizontal: (props) => scrollAreaTrackHorizontal(props),
    renderTrackVertical: (props) => scrollAreaTrackVertical(props),
    renderThumbHorizontal: (props) => scrollAreaThumbHorizontal(props),
    renderThumbVertical: (props) => scrollAreaThumbVertical(props)
  }

  return (
    <Scrollbars {...defaults} style={ style }>
      { children }
    </Scrollbars>
  )
}

export default ScrollArea
