// /**
//  * Created by egayyed on 10/26/16.
//  */
// module.exports = function(app) {
//   var User = app.models.User;
//   var Role = app.models.Role;
//   var RoleMapping = app.models.RoleMapping;
//
//   User.create([
//     {username: 'Ernest', email: 'ernestgayyed@gmail.com', password: 'Qwerty@1'}
//   ], function(err, users) {
//     if (err) throw err;
//
//     console.log('Created users:', users);
//
//     //create the admin role
//     Role.create({
//       name: 'admin'
//     }, function(err, role) {
//       if (err) throw err;
//
//       console.log('Created role:', role);
//
//       //make bob an admin
//       role.principals.create({
//         principalType: RoleMapping.USER,
//         principalId: users[0].id
//       }, function(err, principal) {
//         if (err) throw err;
//
//         console.log('Created principal:', principal);
//       });
//     });
//   });
// };
