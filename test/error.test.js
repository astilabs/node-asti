var asti = require('../');
describe('node-asti.error', function() {

  describe('api.AstiError', function() {
    var AstiError = asti.error.AstiError;
    var err;
    beforeEach(function() {
      err = new AstiError('woops!', 'testError', {det: 'hi'}, {hello:'world'});
    });

    it('should create a new AstiError', function() {
      err.should.be.instanceOf(AstiError);
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
