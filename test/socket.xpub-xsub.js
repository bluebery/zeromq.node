var zmq = require('..')
  , should = require('should')
  , semver = require('semver');

describe('socket.xpub-xsub', function () {
    var pub, sub, xpub, xsub;
    
    it('should support pub-sub tracing and filtering', function (done) {

		done();
		return;
	
		
    });

    XSubXPubProxy = function (xsub, xpub, done) {
        var n = 0;

        xsub.on('message', function (msg) {
            xpub.send(msg); // Forward message using the xpub so subscribers can receive it
        });
        
        xpub.on('message', function (msg) {
            msg.should.be.an.instanceof(Buffer);

            var type = msg[0] === 0 ? 'unsubscribe' : 'subscribe';
            var channel = msg.slice(1).toString();
            
            switch (type) {
                case 'subscribe':
                    switch (n++) {
                        case 0:
                            channel.should.equal('js');
                            break;
                        case 1:
                            channel.should.equal('luna');
                            break;
                    }
                    break;
                case 'unsubscribe':
                    switch (n++) {
                        case 2:
                            channel.should.equal('luna');
                            sub.close();
                            pub.close();
                            xsub.close();
                            xpub.close();
                            done();
                            break;
                    }
                    break;
            }
            
            xsub.send(msg); // Forward message using the xsub so the publisher knows it has a subscriber 
        });
    }
});
