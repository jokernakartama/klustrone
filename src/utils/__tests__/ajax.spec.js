import AX from '../ajax'

describe('utils/ajax.ts', function () {
  describe('AX', function () {
    it('should return it\'s instance after calling at least one method', function () {
      expect(AX.get('/')).to.be.instanceof(AX)
    })
    it('should call defined callback function depending on status code', function (done) {
      const successSpy = sinon.spy()
      const errorSpy = sinon.spy()
      const anywaySpy = sinon.spy()
      AX.get('/').status({
          'success': 200,
          'error': 500,
          'anyway': 'all'
        })
        .on('success', successSpy)
        .on('error', errorSpy)
        .on('anyway', function (b, r) {
          anywaySpy()
          expect(successSpy.called).to.be.true
          expect(errorSpy.called).to.be.false
          expect(anywaySpy.called).to.be.true
          done()
        })
        .send()
    })
    it('should throw an error if url is not specified', function () {
      expect(AX.headers({}).send).to.throw(Error)
    })
  })
})
  
