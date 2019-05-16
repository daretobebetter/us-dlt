'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/

/*
 * Chaincode query
 */

var env = require('./environment');

const peerURL = 'grpcs://' + env.settings.DLT_IP + ':7051';//private AWS  remains the same after reboot
const channelName = 'mychannel';


var Fabric_Client = require('fabric-client');
var path = require('path');
var fs = require('fs');

//
var fabric_client = new Fabric_Client();
let peerCert = fs.readFileSync(path.join(__dirname, '../hfc-key-store/' + env.settings.PEERORG + '-ca-chain.pem'));
let ordererCert = fs.readFileSync(path.join(__dirname, '../hfc-key-store/' + env.settings.ORDERERORG + '-ca-chain.pem'));
let clientKey = fs.readFileSync(path.join(__dirname, '../hfc-key-store/' + env.settings.PEER + '-cli-client.key'));
let clientCert = fs.readFileSync(path.join(__dirname, '../hfc-key-store/' + env.settings.PEER + '-cli-client.crt'));

fabric_client.setTlsClientCertAndKey(Buffer.from(clientCert).toString(), Buffer.from(clientKey).toString());

// setup the fabric network
var channel = fabric_client.newChannel(channelName);
var peer = fabric_client.newPeer(peerURL, { 'pem': Buffer.from(peerCert).toString(), 'ssl-target-name-override': env.settings.PEER });
channel.addPeer(peer);

//
var member_user = null;
var store_path = path.join(__dirname, '../hfc-key-store');
console.log('Store path:' + store_path);
var tx_id = null;



module.exports = {

	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
	query: function (request) {
		var final_result = 'initialization....'
		console.log('inside query function');
		return (Fabric_Client.newDefaultKeyValueStore({ path: store_path })
			.then((state_store) => {
				console.log('inside state store promise');
				// assign the store to the fabric client
				fabric_client.setStateStore(state_store);
				var crypto_suite = Fabric_Client.newCryptoSuite();
				// use the same location for the state store (where the users' certificate are kept)
				// and the crypto store (where the users' keys are kept)
				var crypto_store = Fabric_Client.newCryptoKeyStore({ path: store_path });
				crypto_suite.setCryptoKeyStore(crypto_store);
				fabric_client.setCryptoSuite(crypto_suite);
				//console.log('Got the final result: ' + 'mc: A');
				// get the enrolled user from persistence, this user will sign all requests
				console.log("get user context result: " + fabric_client.getUserContext('user1', true));
				return fabric_client.getUserContext('user1', true);
			}) // end 1st then
			.then((user_from_store) => {
				console.log('inside user from store promise');
				member_user = user_from_store;
				console.log('member user = ' + member_user);
				// send the query proposal to the peer
				console.log('Got the final result: ' + 'mc:B1');
				console.log('request object chaincodId: ' + request.chaincodeId);
				console.log('request object fcn: ' + request.fcn);
				console.log('request object args: ' + request.args);
				console.log('Channel: ' + channel);
				//				console.log('Value from queryByChainCode: ' + channel.queryByChaincode(request));
				return channel.queryByChaincode(request);
				console.log('Got the final result: ' + 'mc: B2');
			}) // end 2nd then
			.then((query_responses) => {
				console.log('Got the final result: ' + 'C');
				console.log('Query response: ' + query_responses[0]);
				final_result = query_responses[0].toString();
				final_result = query_responses[0].toString('utf8');
				console.log('Got the final result: ' + final_result);
				return final_result
			})// end 3rd then
			.catch((err) => {
				console.error('Failed with error: ' + err);
			}) //end catch

		); // end main return

		//end subfunction

	} // end function

}; // end module.exports
