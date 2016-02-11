console.log('Starting in ' + process.cwd());

try {
 process.chdir('..');
} catch (error) {
 console.error('chdir: ' + error.message);
}

console.log('Current working directory is now ' + process.cwd());
