import React from 'react'
import SimpleMarkdown from '../SimpleMarkdown'
import { debug } from 'util';

describe.only('Component <SimpleMarkdown />', () => {
  const blockTags = {
    p: `
      A test paragraph
    `,
    h1: `
      # A header
    `,
    h2: `
      ## A subheader
    `,
    pre: `

      \`\`\`
        # some

        # content

        // which should not be parsed

      \`\`\`

    `,
    ul: `
          * unmarked
         **multiline** **list** 
           just a line
      * contains only two items
    `,
    ol: `
            + align
        ++ like a bull's pee ++
      + contains only two items
    `,
  }
  const lists = ['ul', 'ol']
  for (let tag in blockTags) {
    it('should parse <' + tag + '> tag from children', () => {
      const wrapper = enzyme.mount(<SimpleMarkdown>{ blockTags[tag] }</SimpleMarkdown>)
      expect(wrapper.find(tag)).to.have.length(1)
    })
  }
  lists.forEach((type) => {
    it('should parse list items from <' + type + '> tag', () => {
      const wrapper = enzyme.mount(<SimpleMarkdown>{ blockTags[type] }</SimpleMarkdown>)
      expect(wrapper.find('li')).to.have.length(2)
    })
  })
  const text = `
    This paragraph contains _emphasized_, **strong parts**,
    one line break and two links on https://github.com and [my crap](https://crap.pw)

    * _emphasized phrases_
    * some **strong** words
    * visit https://klustr.one/about to see
    how this [markdown](https://en.wikipedia.org/wiki/Markdown) parser works
  `
  it('should parse inline tags in <p> tag', () => {
    const wrapper = enzyme.mount(<SimpleMarkdown>{ text }</SimpleMarkdown>)
    expect(wrapper.find('p em'), '<em> amount is not matched').to.have.length(1)
    expect(wrapper.find('p strong'), '<strong> amount is not matched').to.have.length(1)
    expect(wrapper.find('p br'), '<br> amount is not matched').to.have.length(1)
    expect(wrapper.find('p a'), '<a> amount is not matched').to.have.length(2)
  })
  it('should parse inline tags in <li> tag', () => {
    const wrapper = enzyme.mount(<SimpleMarkdown>{ text }</SimpleMarkdown>)
    expect(wrapper.find('ul li em'), '<em> amount is not matched').to.have.length(1)
    expect(wrapper.find('ul li strong'), '<strong> amount is not matched').to.have.length(1)
    expect(wrapper.find('ul li br'), '<br> amount is not matched').to.have.length(1)
    expect(wrapper.find('ul li a'), '<a> amount is not matched').to.have.length(2)
  })
})
