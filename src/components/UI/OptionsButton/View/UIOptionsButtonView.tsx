import './styles/UIOptionsButtonView.styl'
import React from 'react'
import bem from '~/utils/bemName'

const BLOCK_NAME = 'dropdown'

const UIOptionsButtonView: React.SFC<IUIOptionsButtonViewComponent.Props> = (props) => {
  const {
    children,
    options,
    className,
    visible,
    toggle,
    hide
  } = props
  const blockClassNames: IBEMEntityObject[] = [{ block: BLOCK_NAME, mod: { visible } }]
  if (className) blockClassNames.push({ block: className })
  const blockClass = bem(blockClassNames)
  const btnClass = bem({ block: BLOCK_NAME, elem: 'button' })
  const wrapperClass = bem([{ block: BLOCK_NAME, elem: 'content-wrapper', mod: { visible } }, { block: 'overlay' }])
  const contentClass = bem({ block: BLOCK_NAME, elem: 'content', mod: { visible } })

  const content = !options ? null : options.map((opt, i) => {
    const optClass = bem({
      block: BLOCK_NAME,
      elem: 'option',
      mod: { type: opt.type, checked: opt.checked }
    })
    const onClickHandler = () => {
      if (opt.action) opt.action()
      if (opt.close !== false) hide()
    }
    return (
      <div key={ i } className={ optClass } onClick={ onClickHandler }>{ opt.label }</div>
    )
  })

  return (
    <div className={ blockClass }>
      <button className={ btnClass } onClick={ toggle }>
        { children }
      </button>
      <div className={ wrapperClass }>
        <div className={ contentClass }>
          { content }
        </div>
      </div>
    </div>
  )
}

export default UIOptionsButtonView
