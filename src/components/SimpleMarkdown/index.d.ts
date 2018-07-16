import React from 'react'

export = ISimpleMarkdownComponent
export as namespace ISimpleMarkdownComponent

declare namespace ISimpleMarkdownComponent {
  interface Props {
    children?: React.ReactNode
  }
}
