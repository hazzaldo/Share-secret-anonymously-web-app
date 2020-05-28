const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

Schema = mongoose.Schema;

passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    googleId: String,
    secret: String
});

// We'll use passport-local-mongoose to hash and salt our passwords and save our users into our MongoDB database
userSchema.plugin(passportLocalMongoose);
// from the findOrCreate npm package which either finds an object or otherwise creates it in Mongoose
userSchema.plugin(findOrCreate);
module.exports = mongoose.model(`User`, userSchema);