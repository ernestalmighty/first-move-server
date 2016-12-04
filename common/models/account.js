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

    Account.observe('before save', function(context, next) {
        if(context.isNewInstance) {
            //check if  bluetooth account already exists
            var filter = {
                where: { deviceAddress : context.instance.deviceAddress }
            };

            Account.app.models.BluetoothAccount.findOne(filter, function(error, response) {
                if(error) return next(error);

                if(!response) {
                    next();
                } else {
                    var err = new Error();
                    err.status = 404;
                    err.message = "Device already registered";
                    next(err);
                }
            });
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
};