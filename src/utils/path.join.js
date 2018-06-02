// Joins path segments.  Preserves initial '/' and resolves '..' and '.'
// Does not support using '..' to go above/outside the root.
// This means that join('foo', '../../bar') will not resolve to '../bar'
export default function join (/* path segments */) {
  // Split the inputs into a list of path commands.
  var parts = []
  for (var i = 0, l = arguments.length; i < l; i++) {
    parts = parts.concat(arguments[i].split('/'))
  }
  // Interpret the path commands to get the new resolved path.
  var newParts = []
  for (i = 0, l = parts.length; i < l; i++) {
    var part = parts[i]
    // Remove leading and trailing slashes
    // Also remove '.' segments
    if (!part || part === '.') continue
    // Interpret '..' to pop the last segment
    if (part === '..') newParts.pop()
    // Push new path segments.
    else newParts.push(part)
  }
  // Turn back into a single string path.
  return newParts.join('/') || (newParts.length ? '/' : '.')
}

// A simple function to get the dirname of a path
// Trailing slashes are ignored. Leading slash is preserved.
export function dirname (path) {
  return join(path, '..')
}

export function getNameFromPath (path) {
  var parsed = /[^/]+$/.exec(path)
  if (parsed !== null) {
    return parsed[0]
  } else {
    return ''
  }
}
