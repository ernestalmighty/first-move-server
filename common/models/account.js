module.exports = function(Account) {

    Account.loginApp = function (loginDetails, callback) {
        var filter = {
            where: { socialMediaToken : loginDetails.socialMediaToken }
        };

        Account.findOne(filter, function (error, account) {
            if(error) next(error);

            if(account) {
                var credentials = {};
                credentials.username = account.username;
                credentials.password = loginDetails.socialMediaToken;

                Account.login(credentials, function (error, accessToken) {
                    if(error) callback(error);

                    callback(null, accessToken);
                });
            } else {
                callback("User not registered yet");
            }
        });
    };

    Account.getAccountDetails = function (accountId, callback) {
        var accountFilter = {
            where: { id : accountId }
        };

        Account.findOne(accountFilter, function (error, account) {
            if(error) callback(error);

            var accountLogin = {};
            accountLogin.account = account;

            var profileFilter = {
                where: { accountId : accountId }
            };

            Account.app.models.Profile.findOne(profileFilter, function (error, profile) {
                if(error) callback(error);

                accountLogin.account.profile = profile;

                var contactFilter = {
                    where: { accountId : accountId }
                };

                Account.app.models.ContactDetail.findOne(contactFilter, function (error, profile) {
                    if(error) callback(error);

                    accountLogin.account.contactDetail = profile;
					
					var bluetoothAccountFilter = {
						where: { accountId : accountId }
					};

					Account.app.models.BluetoothAccount.findOne(bluetoothAccountFilter, function (error, bluetoothAccount) {
						if(error) callback(error);

						accountLogin.account.bluetoothAccount = bluetoothAccount;
						console.log(accountLogin);
						callback(null, accountLogin);
					});
                });
            });
        });
    };

    Account.observe('before save', function(context, next) {
        if(context.isNewInstance) {

            var err = new Error();
            err.status = 404;

            if (!context.instance.deviceAddress) {
                err.message = "Indicate the device address";
                next(err);
            } else if (!context.instance.deviceName) {
                err.message = "Indicate the device name";
                next(err);
            } else if (!context.instance.socialMediaToken) {
                err.message = "Indicate the social media token";
                next(err);
            } else {
                //check if  bluetooth account already exists
                var filter = {
                    where: { deviceAddress : context.instance.deviceAddress }
                };

                Account.app.models.BluetoothAccount.findOne(filter, function(error, response) {
                    if(error) return next(error);

                    if(!response) {
                        context.instance.username = context.instance.use;
                        context.instance.password = context.instance.socialMediaToken;
                        next();
                    } else {
                        err.message = "Device already registered";
                        next(err);
                    }
                });
            }
        }
    });

    Account.observe('after save', function(context, next) {
        if (context.isNewInstance) {
            context.instance.accountId = context.instance.id;
            context.instance.modifiedDate = new Date();
            context.instance.createdDate = new Date();

            Account.app.models.Profile.create(context.instance, function (err, profile) {
                if(err) next(err);

                Account.app.models.BluetoothAccount.create(context.instance, function (err, bluetoothAccount) {
                    if(err) return next(err);

                    Account.app.models.ContactDetail.create(context.instance, function (err, contactDetail) {
                        if(err) return next(err);

                        next();
                    });
                });
            });
        }
    });

    Account.remoteMethod('loginApp', {
        accepts: {arg: "loginDetails", type: "object", http: {source: "body"}},
        returns: {arg: "data", type: "object", root: true}
    });

    Account.remoteMethod('getAccountDetails', {
        accepts: {arg: "accountId", type: "number", http: {source: "path"}},
        returns: {arg: "data", type: "object", root: true},
        http: { path: '/:accountId/getAccountDetails', verb: 'get' }
    });
};