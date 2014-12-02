var yodlr = require('../');
describe('node-yodlr.error', function() {

  describe('api.YodlrError', function() {
    var YodlrError = yodlr.error();
    var err;
    beforeEach(function() {
      err = new YodlrError('woops!', 'testError', {det: 'hi'}, {hello:'world'});
    });

    it('should create a new YodlrError', function() {
      err.should.be.instanceOf(YodlrError);
    });

    it('should have a message', function() {
      err.should.have.property('message');
      err.message.should.eql('woops!');
    });

    it('should have a name', function() {
      err.should.have.property('name');
      err.name.should.eql('testError');
    });

    it('should have details', function() {
      err.should.have.property('details');
      err.details.should.have.property('det');
      err.details.det.should.eql('hi');
    });

    it('should have cause', function() {
      err.should.have.property('cause');
      err.cause.should.have.property('hello');
      err.cause.hello.should.eql('world');
    });

    it('should have a stack', function() {
      err.should.have.property('stack');
    });

  });
});
