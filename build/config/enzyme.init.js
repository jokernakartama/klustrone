var Enzyme = require('../../node_modules/enzyme')
var Adapter = require('../../node_modules/enzyme-adapter-react-16')
Enzyme.configure({adapter: new Adapter()})

window.enzyme = {
  shallow: Enzyme.shallow,
  mount: Enzyme.mount,
  render: Enzyme.render
}
