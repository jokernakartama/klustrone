import bemName from '../bemName'

describe('utils/bemName.ts', function() {
  describe('bemName', function() {
    it('should return proper class name', function () {
      var block = {
        block: 'block'
      }
      var blockMod = {
        block: 'block',
        mod: {
          theme: 'default',
          visible: true
        }
      }
      var elementMod = {
        block: 'list',
        elem: 'item',
        mod: {
          hidden: false,
          active: true
        }
      }
      expect(bemName(block).split(' ')).to.have.members(['block'])
      expect(bemName(blockMod).split(' ')).to.have.members(['block', 'block_theme_default', 'block_visible'])
      expect(bemName(elementMod).split(' ')).to.have.members(['list__item', 'list__item_active'])
    })
  })
})
