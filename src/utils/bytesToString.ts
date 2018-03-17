const steps: string[] = [
  'B',
  'KiB',
  'MiB',
  'GiB',
  'TiB' // tibibytes should be enough
]

const bytesToString  = function (bytes: number, step: number = 0): string {
  if (isNaN(bytes) || !isFinite(bytes)) {
    bytes = 0
  }
  const elder = bytes / 1024
  if (elder < 1 || !steps[step + 1]) {
    return (Math.round(bytes * 100) / 100) + ' ' + steps[step]
  } else {
    return bytesToString (elder, (step + 1))
  }
}

export default bytesToString
