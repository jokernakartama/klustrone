import { getFileExtention } from './getFileType'

const DIR_TYPE_NAME = 'dir'
const DEFAULT_SORT_FIELD = 'name'
const TYPE_FIELD_NAME = 'type'
const PUBLIC_LINK_FIELD_NAME = 'publicLink'

/**
 * @param {object} o - An object of CloudAPI resources
 * @param {string} field - A field to sort by: name, type, size or publicLink
 * @param {boolean} asc - Whether resources should be sorted ascending
 * @returns {array} - Sorted list of resource ids
 */
export default function sortList (o, field = DEFAULT_SORT_FIELD, asc = true) {
  const sorted = Object.keys(o)
  sorted.sort(function (a, b) {
    let j = o[a][field]
    let k = o[b][field]
    let offset = 0
    if (!j || !k) {
      j = Boolean(!j)
      k = Boolean(!k)
    }
    if ((o[a].type === DIR_TYPE_NAME && o[b].type !== DIR_TYPE_NAME) || (o[a].type !== DIR_TYPE_NAME && o[b].type === DIR_TYPE_NAME)) {
      // directories first
      offset = o[b].type === DIR_TYPE_NAME
    } else {
      if (o[a].type === DIR_TYPE_NAME && o[b].type === DIR_TYPE_NAME) {
        // directories can be sorted only by name
        if (field === DEFAULT_SORT_FIELD && !asc) {
          offset = o[b].name > o[a].name
        } else if (field === PUBLIC_LINK_FIELD_NAME) {
          if (asc) {
            offset = j > k
          } else {
            offset = k > j
          }
          if (j && k) offset = o[a].name > o[b].name
        } else {
          offset = o[a].name > o[b].name
        }
      } else {
        if (field === TYPE_FIELD_NAME) {
          let aExt = getFileExtention(o[a].name)
          let bExt = getFileExtention(o[b].name)
          if (asc) {
            offset = aExt > bExt
          } else {
            offset = bExt > aExt
          }
          if (aExt === bExt) offset = o[a].name > o[b].name
        } else {
          if (asc) {
            offset = j > k
          } else {
            offset = k > j
          }
          if (j === k) offset = o[a].name > o[b].name
        }
      }
    }
    if (offset === true) {
      return 1
    } else if (offset === false) {
      return -1
    } else {
      return offset
    }
  })
  return sorted
}
