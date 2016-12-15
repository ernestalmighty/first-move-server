var pubsub = require('../../server/pubsub.js');
module.exports = function(ContactRequest) {
	ContactRequest.observe('before save', function(context, next) {
		if (context.isNewInstance) {
			context.instance.createdDate = new Date();
		}

		next();
	});

	ContactRequest.observe('after save', function(context, next) {
		var socket = ContactRequest.app.io;
		pubsub.publish(socket, {
			toAccount : context.instance.toAccountId,
			data: context.instance
		});
		next();
	});
};