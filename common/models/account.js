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

    Account.updateAccount = function (accountToUpdate, callback) {
        var accountInstance = {};
        accountInstance.id = accountToUpdate.id;
        accountInstance.username = accountToUpdate.username;
        accountInstance.email = accountToUpdate.email;

        var profileInstance = {};
        profileInstance.firstName = accountToUpdate.firstName;
        profileInstance.lastName = accountToUpdate.lastName;
        profileInstance.profileImage = accountToUpdate.profileImage;
        profileInstance.company = accountToUpdate.company;
        profileInstance.jo

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
					callback(null, accountLogin);
                });
            });
        });
    };

    Account.observe('before save', function(context, next) {
        if(context.isNewInstance) {
            var err = new Error();
            err.status = 404;

            if (!context.instance.socialMediaToken) {
                err.message = "Indicate the social media token";
                next(err);
            } else {
                context.instance.username = context.instance.username;
                context.instance.password = context.instance.socialMediaToken;
                next();
            }
        } else {
            next();
        }
    });

    Account.observe('after save', function(context, next) {
        if (context.isNewInstance) {
            context.instance.accountId = context.instance.id;
            context.instance.modifiedDate = new Date();
            context.instance.createdDate = new Date();

            Account.app.models.Profile.create(context.instance, function (err, profile) {
                if(err) next(err);

                Account.app.models.ContactDetail.create(context.instance, function (err, contactDetail) {
                    if(err) return next(err);

                    next();
                });
            });
        } else {
            Account.getAccountDetails(context.instance.id, function(err, account) {
                context.instance.profile = account.profile;
                next();
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

    Account.remoteMethod('updateAccount', {
        accepts: {arg: "accountToUpdate", type: "object", http: {source: "body"}},
        returns: {arg: "data", type: "object", root: true}
    });
};