module.exports = function(ContactRequest) {
	ContactRequest.observe('before save', function(context, next) {
		if (context.isNewInstance) {
			console.log(context.instance.req);
			context.instance.fromAccountId = 1;
			context.instance.requestDate = new Date();
		}

		next();
	});
};