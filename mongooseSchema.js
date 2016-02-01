var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
var dbUrl = 'mongodb://mongorabby:mongo1234@ds055575.mongolab.com:55575/humanresource'

var TeamSchema = new Schema({
 name: {
  type: String,
  required: true
 }
});

var Team = mongoose.model('Team', TeamSchema);

db.on('error', function () {
 console.log('there was an error communication with the database');
});

mongoose.connect(dbUrl, function (err) {
 if (err) {
  return console.log('there was a problem connecting to the database!' + err);
 }

 console.log('connected!');

 team.save(function (error, data) {
  if (error) {
   console.log(error);
  } else {
   console.dir(data);
  }
  db.close();
  process.exit();
 });
});

var EmployeeSchema = new Schema({
 name: {
  first: {
   type: String,
   required: true
  },
  last: {
   type: String,
   required: true
  }
 },
 team: {
  type: Schema.Types.ObjectId,
  ref: 'Team'
 },
 image: {
  type: String,
  default: 'image/user.png'
 },
 address: {
  lines: {
   type: [String]
  },
  postal: {
   type: String
  }
 }
});

mongoose.connect(dbUrl, function() {
 console.log('connected!');

 Team.create({
  name: 'Product Development'
 }, {
  name: 'Dev Ops'
 }, {
  name: 'Accounting'
 }, function (error, pd, devops, acct) {
  if(error) {
   console.log(error);
  } else {
   console.dir(pd);
   console.dir(devops);
   console.dir(acct);

   db.close();
   process.exit();
  }
 });
});
