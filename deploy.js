var https = require('https');
var path = require('path');
var fs = require('fs');

var config;
try {
  config = require('./config.json');
} catch (err) {
  console.log(`Could not load config file (${err.message})`);
  process.exit(1);
}

/** @var {string} config.email */
if (typeof config.email !== 'string' || config.email.length === 0) {
  console.log('Email is missing');
  process.exit(1);
}

/** @var {string} config.password */
if (typeof config.password !== 'string' || config.password.length === 0) {
  console.log('Password is missing');
  process.exit(1);
}

/** @var {string} config.branch */
var branch = 'default';
if (typeof config.branch === 'string' && config.branch.length !== 0) {
  branch = config.branch;
}

console.log(`Deploying to branch "${branch}"`);

var payload = {
  branch: branch,
  modules: {}
};

function loadFileContent(src) {
  return fs.readFileSync(path.join(__dirname, src), {encoding: 'utf-8'});
}

try {
  payload.modules.main = loadFileContent('src/main.js');
  fs.readdirSync(path.join(__dirname, 'src/node_modules')).forEach((file) => {
    payload.modules[path.parse(file).name] = loadFileContent('src/node_modules/' + file);
  });
} catch (err) {
  console.log(err.message);
  process.exit(1);
}

var req = https.request({
  hostname: 'screeps.com',
  port: 443,
  path: '/api/user/code',
  method: 'POST',
  auth: config.email + ':' + config.password,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
}, (res) => {
  res.on('data', (data) => {
    console.log(data.toString());
  })
});

// console.log(JSON.stringify(payload, null, 2));
req.write(JSON.stringify(payload));
req.end();

req.on('error', (e) => {
  console.error(e);
});
