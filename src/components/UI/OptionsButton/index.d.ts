import React from 'react'

export = IUIOptionsButtonComponent
export as namespace IUIOptionsButtonComponent

declare namespace IUIOptionsButtonComponent {
  /**
   * @interface
   * @param {string} type - Defines how the option should be rendered
   * @param {boolean} drop - Whether the options list should be closed after
   * the option has been selected
   * @param {string} label - Option label
   * @param {boolean} checked - Predefined option state
   * @param {function} action - Function that runs when option has been selected
   */
  interface Option {
    type: string
    label: string
    close?: boolean
    checked?: boolean
    action?: () => void
  }

  interface Props {
    children?: React.ReactNode
    className?: string
    options: Option[]
  }

  interface State {
    visible: boolean 
  }
}
