const expirationTime = function (seconds: string|number): number {
  const now = Date.now() / 1000 | 0
  return (+seconds) + now
}

export default expirationTime
