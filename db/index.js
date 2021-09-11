// require and re-export all files in this db directory (users, activities...)

// const {
//   client,
//   users,
//   activities,
//   routines,
//   routine_activities,
// } = require("./db");
module.exports = {
  ...require("./client"), // adds key/values from users.js
  ...require("./users"), // adds key/values from users.js
  ...require("./activities"), // adds key/values from activites.js
  ...require("./routines"), // etc
  ...require("./routine_activities"), // etc
};

//  module.exports = {
//    //client,
//    users,
//    activities,
//    routines,
//    routine_activities,
// };
