// var Bookshelf = require('bookshelf');
var path = require('path');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.connect('mongodb://127.0.0.1/myTestDB');  

var db = mongoose.connection;
console.log("db is: ", db);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("working!!!!");
});

var userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required:true},
  created_at: Date,
  updated_at: Date
});


userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.model.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.statics.hashPassword = function(password, cb){
  var cipher = Promise.promisify(bcrypt.hash);
  console.log("current this is : ", this);
  return cipher(password, null, null).bind(this)
    .then(function(hash) {
      console.log(hash)
      cb(hash)
    });
};


var urlsSchema = new Schema({
  url: {type: String, required: true},
  base_url : {type: String, required: true},
  code : {type: String, required: true},
  title : {type: String, required: true},
  visits : {type: Number},
  created_at: Date,
  updated_at: Date
});

urlsSchema.pre('save', function(next){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
});



exports.User = mongoose.model('User', userSchema);
exports.Link = mongoose.model('Link', urlsSchema);




// var db = Bookshelf.initialize({
//   client: 'sqlite3',
//   connection: {
//     host: '127.0.0.1',
//     user: 'your_database_user',
//     password: 'password',
//     database: 'shortlydb',
//     charset: 'utf8',
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = db;
