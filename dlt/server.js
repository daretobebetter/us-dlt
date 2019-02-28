/*
#  Generic webservice template to invoke/interact with Hyperledger Fabric
#  Based on open sourced code, examples and knowledge shared by the Hyperledger comunity.
#  Particularly IBM open sourced examples and documentation
#  SPDX-License-Identifier: Apache-2.0 
#  version 1.1 June 2018 
*/


var http = require('http');
var express = require('express');
var port = process.env.PORT || 6001 
var app = express();
var appRoutes = require('./routes/appRoutes');
var bodyParser = require('body-parser');
var cors = require('cors');




app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use('/',appRoutes);
http.createServer(app).listen(port);

console.log("Backend micro service  running on port: ", port);
