var fs = require('fs');
var data;

try {
 data = fs.readFileSync(__filename, { encoding: 'utf8'} );
 console.log(data);
} catch (error) {
 console.error(error.message);
}
