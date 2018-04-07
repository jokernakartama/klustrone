import './styles/icon.styl'
import React from 'react'
import bem from '~/utils/bemName'

interface IIconComponentProps {
  children?: React.ReactNode
  className?: string
  icon: string
}

const Icon: React.SFC<IIconComponentProps> = (props) => {
  const iconClassNames = [
    { block: 'icon', mod: { [icon]: true } },
    { block: props.className }
  ]
  return <i className={ bem(iconClassNames) } />
}

export default Icon
