import React from 'react'
import UIScrollArea from '~/components/UI/ScrollArea'

class SimpleMarkdown extends React.PureComponent<ISimpleMarkdownComponent.Props> {
  public static parse (text: string) {
    const pre = /(```\n[\S,\s]*?```)/
    const sections = text.split(pre)
    let parsed = []
    sections.forEach((block, n) => {
      if (pre.test(block)) {
        const isPre = pre.exec(block)
        parsed.push(
          <pre key={ `pre_${n}` }>
            <UIScrollArea>
              { isPre[1].slice(4, -4) }
            </UIScrollArea>
          </pre>
        )
      } else if (block.trim() !== '') {
        const startIndex = parsed.length
        parsed = parsed.concat(this.parseBlockElements(block, startIndex))
      }
    })
    return parsed
  }
  private static parseBlockElements (text: string, startIndex: number = 0) {
    const sections = text.split('\n\n')
    const h1 = /#\s(.+)/
    const h2 = /##\s(.+)/
    const p = /([^\n](?:[^\n]|\n[^\n]+)+)/
    const ul = /(\*[^\S\n\r][^\n\r]+(\n?[^\n]+)*)/
    const ol = /(\+[^\S\n\r][^\n\r]+(\n?[^\n]+)*)/
    const parsed = []
    sections.forEach((block, i) => {
      if (h2.test(block)) {
        const isH2 = h2.exec(block)
        parsed.push(<h2 key={ `h2_${i + startIndex}` }>{ isH2[1] }</h2>)
      } else if (h1.test(block)) {
        const isH1 = h1.exec(block)
        parsed.push(<h1 key={ `h1_${i + startIndex}` }>{ isH1[1] }</h1>)
      } else if (ol.test(block)) {
        const isOL = ol.exec(block)
        parsed.push(<ol key={ `ol_${i + startIndex}` }>{ this.parseListElements(isOL[1]) }</ol>)
      } else if (ul.test(block)) {
        const isUL = ul.exec(block)
        parsed.push(<ul key={ `ul_${i + startIndex}` }>{ this.parseListElements(isUL[1]) }</ul>)
      } else if (p.test(block)) {
        const isP = p.exec(block)
        parsed.push(
          <p key={ `p_${i + startIndex}` }>
            { this.parseInlineElements(isP[1]) }
          </p>
        )
      }
    })
    return parsed
  }
  private static parseListElements (text: string) {
    const parts = text.match(/(\*|\+)[^\S\n]([^\n]+(?:\n(?![^\S]*\1[^\S\n])[^\n]+(?=\S|\n))*)/g)
    if (parts !== null) {
      return parts.map((item, i) => {
        return <li key={ `li_${i}` }>{ this.parseInlineElements(item.slice(2)) }</li>
      })
    } else {
      // should not be reachable, but who knows?
      return this.parseInlineElements(text)
    }
  }
  private static parseInlineElements (text: string) {
    const inlines = /(https?:\/\/[^\s]+|\[[^\]]+\]\([^\)]+\)|_.+?_|\*\*.+?\*\*|\n|\r)/
    const br = /\n|\r/
    const strong = /\*\*(.+?)\*\*/
    const em = /_(.+?)_/
    const a = /(https?:\/\/[^\s]+)|\[([^\]]+)\]\(([^\)]+)\)/
    const sections = text.split(inlines)
    const parsed = []
    sections.forEach((block, i) => {
      if (br.test(block)) {
        parsed.push(<br key={ `br_${i}` }/>)
      } else if (strong.test(block)) {
        const isSTRONG = strong.exec(block)
        parsed.push(<strong key={ `strong_${i}` }>{ isSTRONG[1] }</strong>)
      } else if (em.test(block)) {
        const isEM = em.exec(block)
        parsed.push(<em key={ `em_${i}` }>{ isEM[1] }</em>)
      } else if (a.test(block)) {
        const isA = a.exec(block)
        const href = isA[1] || isA[3]
        const label = isA[2] || href
        parsed.push(<a href={ href } key={ `a_${i}` }>{ label }</a>)
      } else {
        parsed.push(block)
      }
    })
    return parsed
  }

  public render () {
    const { children } = this.props
    let content = children
    if (typeof children === 'string') content = SimpleMarkdown.parse(children)
    return (
      <React.Fragment>
        { content }
      </React.Fragment>
    )
  }
}

export default SimpleMarkdown
