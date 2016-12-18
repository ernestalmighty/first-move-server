var pubsub = require('../../server/pubsub.js');
var mysql = require('mysql');
var app = require(__dirname + "/../../server/server");
var dataSource = app.datasources.first_move_db;

module.exports = function(ContactRequest) {
	ContactRequest.getAccountRequests = function(accountId, callback) {
		var sql = "SELECT a.id," +
		" cr.contactRequestId, " +
		" a.username," +
		" p.profileImage," +
		" cr.requestMessage" +
		" FROM contactrequest cr" +
		" INNER JOIN account a" +
		" ON cr.fromAccountId = a.id" +
		" INNER JOIN profile p" +
		" ON cr.fromAccountId = p.accountId" +
		" WHERE cr.toAccountId = ?" +
		" AND cr.status = 'pending'"
		" ORDER BY cr.createdDate DESC";
		
		dataSource.connector.client.query(sql, [accountId], callback);
	}; 
	
	ContactRequest.acceptContactRequest = function(contactRequestId, callback) {
		var sql = "UPDATE contactrequest SET status = 'accepted' WHERE contactRequestId = ?"
		
		dataSource.connector.client.query(sql, [contactRequestId], callback);
	};
	
	ContactRequest.getExistingRequests = function(firstAccountId, secondAccountId, callback) {
		var sql = "SELECT contactRequestId, status FROM contactrequest WHERE (toAccountId = ? AND fromAccountId = ?) OR (toAccountId = ? AND fromAccountId = ?)"
		
		dataSource.connector.client.query(sql, [firstAccountId, secondAccountId, secondAccountId, firstAccountId], function(err, data) {
			
		)};
	};
	
	ContactRequest.getContactList = function(accountId, callback) {
		var sql = "SELECT contactRequestId, status FROM contactrequest WHERE (toAccountId = ? OR fromAccountId = ?) AND status = 'accepted'";
		
		dataSource.connector.client.query(sql, [firstAccountId, secondAccountId, secondAccountId, firstAccountId], function(err, data) {
			
		)};
	};

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
				account.requestMessage = context.instance.requestMessage;
				account.contactRequestId = context.instance.contactRequestId;

				var socket = ContactRequest.app.io;
				pubsub.publish(socket, {
					toAccount : context.instance.toAccountId,
					data: account
				});
				next();
			});
		});
	});
	
	ContactRequest.remoteMethod('getAccountRequests', {
        accepts: {arg: "accountId", type: "number", http: {source: "path"}},
        returns: {arg: "data", type: "object", root: true},
		http: { path: '/:accountId/getAccountRequests', verb: 'get' }
    });
	
	ContactRequest.remoteMethod('acceptContactRequest', {
		accepts: {arg: "contactRequestId", type: "number", http: {source: "path"}},
		returns: {arg: "data", type: "object", root: true},
		http: {path: '/:contactRequestId/acceptContactRequest', verb: 'post'}
	});
	
	ContactRequest.remoteMethod('getExistingRequests', {
        accepts: [{arg: "firstAccountId", type: "number", http: {source: "path"}}, 
				 {arg: "secondAccountId", type: "number", http: {source: "path"}}],
        returns: {arg: "data", type: "object", root: true},
		http: { path: '/:firstAccountId/:secondAccountId/getExistingRequests', verb: 'get' }
    });
	
	ContactRequest.remoteMethod('getContactList', {
        accepts: {arg: "accountId", type: "number", http: {source: "path"}},
        returns: {arg: "data", type: "object", root: true},
		http: { path: '/:accountId/getContactList', verb: 'get' }
    });
};