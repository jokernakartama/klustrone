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
  var sorted = Object.keys(o)
  sorted.sort(function (a, b) {
    var j = o[a][field]
    var k = o[b][field]
    if (!j || !k) {
      j = Boolean(!j)
      k = Boolean(!k)
    }
    if ((o[a].type === DIR_TYPE_NAME && o[b].type !== DIR_TYPE_NAME) || (o[a].type !== DIR_TYPE_NAME && o[b].type === DIR_TYPE_NAME)) {
      // directories first
      return o[b].type === DIR_TYPE_NAME
    } else {
      if (o[a].type === DIR_TYPE_NAME && o[b].type === DIR_TYPE_NAME) {
        // directories can be sorted only by name
        if (field === DEFAULT_SORT_FIELD && !asc) {
          return o[b].name > o[a].name
        } else if (field === PUBLIC_LINK_FIELD_NAME) {
          if (asc) {
            return j > k
          } else {
            return k > j
          }
        } else {
          return o[a].name > o[b].name
        }
      } else {
        if (field === TYPE_FIELD_NAME) {
          if (asc) {
            return getFileExtention(o[a].name) > getFileExtention(o[b].name)
          } else {
            return getFileExtention(o[b].name) > getFileExtention(o[a].name)
          }
        } else {
          if (asc) {
            return j > k
          } else {
            return k > j
          }
        }
      }
    }
  })
  return sorted
}
