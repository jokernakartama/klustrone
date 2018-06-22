import './styles/UIIconView.styl'
import React from 'react'
import bem from '~/utils/bemName'

interface IIconComponentProps {
  children?: React.ReactNode
  className?: string
  icon: string
}

const Icon: React.SFC<IIconComponentProps> = ({ children, icon, className}) => {
  const iconClassNames = []
  iconClassNames.push({ block: 'icon', mod: { [icon]: true } })
  if (className) iconClassNames.push({ block: className })
  return <i className={ bem(iconClassNames) }>{ children }</i>
}

export default Icon
