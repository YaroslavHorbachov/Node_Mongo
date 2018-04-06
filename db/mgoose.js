var mongoose = require('mongoose');
var schema = require('./schemas/schema').USchemas;
console.log(mongoose.version);

var db = mongoose.createConnection('mongodb://localhost/nodejs-test-db');
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback () {
    console.log("Connected DB!")
});
var User = db.model("User", schema);




module.exports.createUser = User;
