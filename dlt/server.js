/*
#  Generic webservice template to invoke/interact with Hyperledger Fabric
#  Based on open sourced code, examples and knowledge shared by the Hyperledger comunity.
#  Particularly IBM open sourced examples and documentation
#  SPDX-License-Identifier: Apache-2.0 
#  version 1.1 June 2018 
*/

var log4js = require('log4js');

/**
 * make a log directory, just in case it isn't there.
 */
try {
  require('fs').mkdirSync('./logs');
} catch (e) {
  if (e.code != 'EEXIST') {
    console.error('Could not set up log directory, error was: ', e);
    process.exit(1);
  }
}

var logger = log4js.getLogger('app');
var consoleLog = log4js.getLogger('consoleLog');
console.log = consoleLog.info.bind(consoleLog);
console.warn = logger.info.bind(logger);
console.info = logger.info.bind(logger);
console.debug = logger.debug.bind(logger);
console.error = logger.error.bind(logger);

/* ENVIRONMENTS */

var ENV = process.env.NODE_ENV;
if (!ENV) {
  ENV = 'test';
}

switch (ENV) {
  case 'development':
    log4js.configure('./_configs/log4js.json');
    break;
  case 'production':
    log4js.configure('./_configs/log4js.prod.json');
    break;
  case 'preprod':
    log4js.configure('./_configs/log4js.prod.json');
    break;
  case 'test':
    log4js.configure('./_configs/log4js.prod.json');
    break;
  case 'demo':
    log4js.configure('./_configs/log4js.prod.json');
    break;
  case 'tic':
    log4js.configure('./_configs/log4js.prod.json');
    break;
  default:
    log4js.configure('./_configs/log4js.json');
    break;
}

var http = require('http');
var express = require('express');
var port = process.env.PORT || 6001;
var app = express();
var appRoutes = require('./routes/appRoutes');
var bodyParser = require('body-parser');
var cors = require('cors');

let apiKeyAuth = require('./api-key-auth'); // encryption

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(apiKeyAuth({}));
app.use('/', appRoutes);
http.createServer(app).listen(port, () => console.log(`Backend DLT services started and run on port ${port}`));
