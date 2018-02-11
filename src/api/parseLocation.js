export const TRASH_URL_IDENTIFIER = 'trash'

export default function (location) {
  if (typeof location === 'string') {
    // remove a slash at the begining
    const locationData = location.slice(1).split(/\/(.*)/, 2)
    const serviceData = locationData[0].split(':', 2)
    const path = locationData[1] || ''
    var isTrash = false
    var serviceName
    if (serviceData.length === 2) {
      serviceName = serviceData[0]
      isTrash = serviceData[1] === TRASH_URL_IDENTIFIER
    }
    return {
      service: serviceName,
      path,
      isTrash
    }
  } else {
    return false
  }
}
