// /**
//  * Created by egayyed on 10/26/16.
//  */
var server = require('./server');
var ds = server.dataSources.first_move_db;
var lbTables = ['Account'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});