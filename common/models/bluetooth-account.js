module.exports = function(BluetoothAccount) {
  var app = require(__dirname + "/../../server/server");
  var dataSource = app.dataSources.first_move_db;

  BluetoothAccount.listDevices = function(deviceList, callback) {
    var deviceLength = deviceList.length;

    if(!deviceLength) {
      callback('No device list');
    }

    for(var i = 0; i < deviceLength; i++) {
      deviceList[i] = "'" + deviceList[i] + "'";
    }

    var devices = deviceList.join(',');

    var sql = 'SELECT ' +
        'a.username, b.deviceName, b.deviceAddress, c.profileImage ' +
        'FROM ' +
        'Account a ' +
        'INNER JOIN ' +
        'BluetoothAccount b ' +
        'ON a.id = b.accountId ' +
        'INNER JOIN ' +
        'Profile c ' +
        'ON a.id = c.accountId ' +
        'WHERE b.deviceAddress IN ( ' + devices + ' )';

    dataSource.connector.client.query(sql, [], function (error, result) {
      if(error) callback(error);

      callback(null, result);
    });
  };

  BluetoothAccount.observe('before save', function(context, next) {
    if (context.isNewInstance) {
      context.instance.createdDate = new Date();
    }

    next();
  });

  BluetoothAccount.remoteMethod('listDevices', {
    accepts: {arg: "deviceList", type: "object", http: {source: "body"}},
    returns: {arg: "data", type: "object", root: true}
  });
};