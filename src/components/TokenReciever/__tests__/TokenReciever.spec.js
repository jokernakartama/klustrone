import React from 'react'
import TokenReciever from '../TokenReciever'

describe('Component <TokenReciever />', () => {
  it('should render a presentational component as an endpoint', () => {
    const wrapper = enzyme.shallow(<TokenReciever />)
    expect(wrapper.name()).to.equal('TokenRecieverView')
  })
})
