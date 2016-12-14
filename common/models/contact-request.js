module.exports = function(ContactRequest) {
	ContactRequest.observe('before save', function(context, next) {
		if (context.isNewInstance) {
			context.instance.createdDate = new Date();
		}

		next();
	});
};