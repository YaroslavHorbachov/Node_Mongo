var mongoose = require('mongoose');
var UserS = new mongoose.Schema( {
    name: { type: String}
} );
module.exports.USchemas = UserS;