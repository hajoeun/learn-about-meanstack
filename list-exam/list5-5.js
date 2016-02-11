var fs = require('fs');

fs.readFile(__filename, function(error, data){
 if (error) {
  return console.error(error.message);
 }

 console.log(data.toString());
});
