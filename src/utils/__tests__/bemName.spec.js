import bemName from '../bemName'

describe('utils/bemName.ts', function() {
  describe('bemName', function() {
    it('should return proper class name', function () {
      const block = {
        block: 'block'
      }
      const blockMod = {
        block: 'block',
        mod: {
          theme: 'default',
          visible: true
        }
      }
      const blockModBoolFalse = {
        block: 'block',
        mod: {
          visible: false
        }
      }
      const elementMod = {
        block: 'list',
        elem: 'item',
        mod: {
          hidden: false,
          active: true
        }
      }

      expect(bemName(block).split(' ')).to.have.members(['block'])
      expect(bemName(blockMod).split(' ')).to.have.members(['block', 'block_theme_default', 'block_visible'])
      expect(bemName(blockModBoolFalse).split(' ')).to.have.members(['block'])
      expect(bemName(elementMod).split(' ')).to.have.members(['list__item', 'list__item_active'])
    })
    it('should convert camelCase names to kebab-case', function () {
      const camelCasedBlock = {
        block: 'elementList',
        elem: 'listItem',
        mod: {
          isVisible: true,
          itemType: 'simpleItem'
        }
      }
      expect(bemName(camelCasedBlock).split(' ')).to.have.members([
        'element-list__list-item',
        'element-list__list-item_is-visible',
        'element-list__list-item_item-type_simple-item'
      ])
    })
  })
})
