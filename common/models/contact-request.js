var pubsub = require('../../server/pubsub.js');
module.exports = function(ContactRequest) {
	ContactRequest.observe('before save', function(context, next) {
		if (context.isNewInstance) {
			context.instance.createdDate = new Date();
		}

		next();
	});

	ContactRequest.observe('after save', function(context, next) {
		var accountFilter = {
			where: { id : context.instance.fromAccountId }
		};

		ContactRequest.app.models.Account.findOne(accountFilter, function (error, account) {
			if(error) callback(error);

			var profileFilter = {
				where: { accountId : context.instance.fromAccountId }
			};

			ContactRequest.app.models.Profile.findOne(profileFilter, function (error, profile) {
				if(error) callback(error);

				account.profile = profile;

				var socket = ContactRequest.app.io;
				pubsub.publish(socket, {
					toAccount : context.instance.toAccountId,
					data: account
				});
				next();
			});
		});
	});
};