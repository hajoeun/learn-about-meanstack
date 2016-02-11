var mongoose = require('mongoose');
var dbUrl = 'mongodb://mongorabby:mongo1234@ds055575.mongolab.com:55575/humanresource'

mongoose.connect(dbUrl);

// 컨트롤 + C를 누르면 몽구스 연결 종료
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected');
    process.exit(0);
  });
});

require('../models/employee');
require('../models/team');
