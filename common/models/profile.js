module.exports = function(Profile) {

  Profile.register = function (profileDetails, callback) {
    Profile.create(profileDetails, function (err, profile) {
      if(err) callback(err);

      profileDetails.profileId = profile.profileId;

      Profile.app.models.BluetoothAccount.create(profileDetails, function (err, bluetoothAccount) {
        if(err) {
          return callback(err);
        }

        return callback(bluetoothAccount);
      });
    });
  };

  Profile.login = function (loginDetails, callback) {
    var filter = {
      where: { password : loginDetails.password }
    };

    Profile.findOne(filter, function(error, response) {
      if(error) {
        return callback(error);
      }

      return callback(response);
    });
  };

  Profile.observe('before save', function(context, next) {
    if (context.isNewInstance) {
      context.instance.modifiedDate = new Date();
      context.instance.createdDate = new Date();
    } else {
      context.data.modifiedDate = new Date();
    }
    next();
  });

  Profile.remoteMethod(
    'register',
    {
      accepts: {arg: 'profileDetails', type: 'object', http: {source : 'body'}},
      returns: {arg: 'userProfile', type: 'object', root: true}
    }
  );

  Profile.remoteMethod(
    'login',
    {
      accepts: {arg: 'loginDetails', type: 'object', http: {source : 'body'}},
      returns: {arg: 'userProfile', type: 'object', root: true}
    }
  );
};
