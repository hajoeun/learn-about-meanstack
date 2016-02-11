var fs = require('fs');
var data = fs.readFileSync('foo.txt', { encoding : 'utf8'});

fs.writeFile(__dirname + '/bar.txt', data, { flag: 'a' }, function(error) {
 if(error) {
  return console.error(error.message);
 }
});
