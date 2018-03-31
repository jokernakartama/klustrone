var Enzyme = require('../../node_modules/enzyme')
var Adapter = require('../../node_modules/enzyme-adapter-react-16')
Enzyme.configure({adapter: new Adapter()})

window.shallow = Enzyme.shallow
window.mount = Enzyme.mount
window.render = Enzyme.render
