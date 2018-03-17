import bytesToString from '../bytesToString'

describe('utils/bytesToString.ts', function() {
  describe('bytesToString', function() {
    it('should return 2 tebibytes converting 2 * 2^40 bytes', function () {
      expect(bytesToString(2 * (Math.pow(2, 40)))).to.equal('2 TiB')
    })
    it('should return 2048 tebibytes converting 2 * 2^50 bytes', function () {
      expect(bytesToString(2 * (Math.pow(2, 50)))).to.equal('2048 TiB')
    })
    it('should return 0 bytes if it is not a real number', function () {
      expect(bytesToString(NaN)).to.equal('0 B')
      expect(bytesToString(Infinity)).to.equal('0 B')
    })
  })
})
