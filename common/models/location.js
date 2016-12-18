module.exports = function(Location) {
	var mysql = require('mysql');
	var app = require(__dirname + "/../../server/server");
	var dataSource = app.datasources.first_move_db;
	
	Location.getNearbyUsers = function(accountId, latitude, longitude, callback) {
		//get the top 10 nearby locations within 100 meters
		var sql = "SELECT l.accountId, a.username, p.profileImage, " +
			"(6371000 * acos(cos(radians(' + latitude + ')) * cos(radians(latitude)) * cos(radians(longitude) - radians(' + longitude + ')) + sin(radians(' + latitude + ')) * sin(radians(latitude)))) AS distance " +
			"FROM location l " +
			"INNER JOIN account a " +
			"ON a.id = l.accountId " +
			"INNER JOIN profile p " +
			"ON p.accountId = a.id "  +
			"WHERE a.id != ? AND NOT EXISTS " +
			"(SELECT contactRequestId FROM contactrequest WHERE (fromAccountId = ? AND toAccountId = l.accountId) OR " +
			"(toAccountId = ? AND fromAccountId = l.accountId)) " +
			//comment out once pushed to release
			//'HAVING distance < 100 " +
			"ORDER BY distance LIMIT 10;"
		
		dataSource.connector.client.query(sql, [accountId, accountId, accountId], callback);
	};

	Location.remoteMethod('getNearbyUsers', {
        accepts: [{arg: "accountId", type: "number", required: true, http: {source:'path'} },
				  {arg: "latitude", type: "number", required: true, http: {source:'path'} },
				  {arg: "longitude", type: "number", required: true, http: {source:'path'} }],
        returns: {arg: "data", type: "object", root: true},
        http: { path: '/:accountId/getNearbyUsers/:latitude/:longitude', verb: 'get' }
    });
};
