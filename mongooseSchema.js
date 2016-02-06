var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
var dbUrl = 'mongodb://mongorabby:mongo1234@ds055575.mongolab.com:55575/humanresource'

// Team 스키마 생성
var TeamSchema = new Schema({
 name: {
  type: String,
  required: true
 }
});
// 실제로 Team 모델 생성을 원할 때 TeamSchema를 고수해야함을 명시
var Team = mongoose.model('Team', TeamSchema);

// Employee 스키마 생성
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
// 실제로 Employee 모델 생성을 원할 때 EmployeeSchema를 고수해야함을 명시
var Employee = mongoose.model('Employee', EmployeeSchema);

db.on('error', function () {
 console.log('there was an error communication with the database');
});

// 새로운 팀 형성 및 삽입
function insertTeams (callback) {
  Team.create({
    name: 'Product Development'
  }, {
    name: 'Dev Ops'
  }, {
    name: 'Accounting'
  }, function (error, pd, devops, acct) {
    if (error) {
      return callback(error);
    } else {
      console.info('teams successfully added')
      callback(null, pd, devops, acct);
    }
  });
}

// 복수의 직원 목록 삽입
function insertEmployees (pd, devops, acct, callback) {
  Employee.create({
    name: {
      first: 'John',
      last: 'Adams'
    },
    team: pd._id,
    address: {
      lines: ['2 Lincoln Memorial Cir NW'],
      postal: '20037'
    }
  }, {
    name: {
      first: 'Thomas',
      last: 'Jefferson'
    },
    team: devops._id,
    address: {
      lines: ['1600 Pennsylvania Avenue', 'White House'],
      postal: '20500'
    }
  }, {
    name: {
      first: 'James',
      last: 'Madison'
    },
    team: acct._id,
    address: {
      lines: ['2 15th St NW', 'PO Box 8675309'],
      postal: '20007'
    }
  }, {
    name: {
      first: 'James',
      last: 'Monroe'
    },
    team: acct._id,
    address: {
      lines: ['1850 West Basin Dr SW', 'Suite 210'],
      postal: '20242'
    }
  }, function (error, johnadams) {
    if (error) {
      return callback(error);
    } else {
      console.info('employees successfully added');
      callback(null, {
        team: pd,
        employee: johnadams
      });
    }
  })
}

// 단순 질의 : ID를 이용한 문서 검색
function retrieveEmployee (data, callback) {
  Employee.findOne({
    _id: data.employee._id
  }).populate('team').exec(function (error, result) {
    if (error) {
      return callback (error);
    } else {
      console.log('*** Single Employee Result ***');
      console.dir(result);
      callback(null, data);
    }
  });
}

// 이름으로 직원 검색
function retrieveEmployees (data, callback) {
  Employee.find({
    'name.first': /J/i
  }, function (error, results) {
    if (error) {
      return callback(error);
    } else {
      console.log('*** Multiple Employees Result ***')
      console.dir(results);
      callback(null, data);
    }
  });
}

// 직원 갱신 코드
function updateEmployee (first, last, data, callback) {
  console.log('*** Changing names ***');
  console.dir(data.employee);

  var employee = data.employee;
  employee.name.first = first;
  employee.name.last = last

  employee.save(function (error, result) {
    if (error) {
      return callback(error);
    } else {
      console.log('*** Changed name to Andrew Jackson ***');
      console.log(result);
      callback(null, data);
    }
  });
}

// 데이터 전체 삭제 코드 (숙제)
function deleteEmployee (data, callback) {
 Employee.remove({
  'name.first': 'James'
 }, function (error, results) {
  if (error) {
   return callback(error);
  } else {
   console.log('*** Remove Employee Result ***')
   console.dir(results);
   callback(null, data);
  }
 });
}


// 실제 코드 호출 부분
mongoose.connect(dbUrl, function (err) {
  if (err) {
    return console.log('there was a problem connecting to the database!' + err);
  }
  console.log('connected!');

  insertTeams(function (err, pd, devops, acct) {
    if (err) {
      return console.log(err)
    }
    insertEmployees(pd, devops, acct, function (err, result) {

      retrieveEmployee(result, function (err, result) {

        retrieveEmployees(result, function (err, result) {

          updateEmployee('Andrew', 'Jackson', result, function (err, result) {

           deleteEmployee(result, function (err, result) {
            if (err) {
              console.error(err);
            } else {
              console.info('database activity complete')
            }
            db.close();
            process.exit();
           });
          });
        });
      });
    });
  });
});
