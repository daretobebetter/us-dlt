/*
#  Generic smart contract for Hyperledger Fabric
#  Based on open sourced code, examples and knowledge shared by the Hyperledger comunity.
#  Particularly IBM open sourced examples and documentation
#  SPDX-License-Identifier: Apache-2.0 
#  version 1.1 June 2018 
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

  // The Init method is called when the Smart Contract 'asset' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger() bellow
  async Init(stub) {
    console.info('=========== Instantiated asset chaincode ===========');
    return shim.success();
  }


  // The Invoke method is called as a result of an application request to run the Smart Contract 'asset'.
  // The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }


  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    // place holder
    console.info('============= END : Initialize Ledger ===========');
  }

  async createAsset(stub, args) {
    console.info('============= START : Create Asset ===========');
    console.info('JSON ARGS: ' + args);
    let jsonData = JSON.parse(args); // this is the asset record in JSON format
    //let jsonID = jsonData.id; // this is dltID of the asset
    console.info(`=============debug jsonID =========== ${jsonData.id}`);
    console.info(`=============debug jsonData =========== Buffer.from(JSON.stringify(jsonData))`);
    await stub.putState(jsonData.id, Buffer.from(JSON.stringify(jsonData)));
    console.info('============= END : Create Asset ===========');
  }



  async createBulkAsset(stub, args) {
    console.info('============= START : Create Bulk Asset ===========');

    let jsonData = JSON.parse(args);

    for (let i = 0; i < jsonData.length; i++) {
      //await stub.putState(Buffer.from(jsonData[0].Key), Buffer.from(JSON.stringify(jsonData[i].Record)));
      //  console.info(`=============debug id =========== ${jsonData[i].id}`);
      //  console.info(`=============debug dltAssetData =========== ${  JSON.stringify(jsonData[i]) }`);
      await stub.putState(jsonData[i].id, Buffer.from(JSON.stringify(jsonData[i])));
    }

    console.info('============= END : Create Bulk Asset ===========');
  }





  async changeAssetStatus(stub, args) {
    console.info('============= START : changeAssetStatus ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let assetAsBytes = await stub.getState(args[0]);
    let asset = JSON.parse(assetAsBytes);
    asset.status = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(asset)));
    console.info('============= END : changeAssetStatus ===========');
  }



  // ==================================================
  // delete - remove a key/value pair from state
  // ==================================================
  async deleteAsset(stub, args, thisClass) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting id of the asset to be delete');
    }
    let key = args[0];
    if (!key) {
      throw new Error('id must not be empty');
    }

    await stub.deleteState(key); //remove the asset from chaincode state

  }


  // To be added: advanced delete with index maintenance, see IBM's marber sample 



  // Regular queries 

  // async _queryAsset(stub, args) {
  //   if (args.length != 1) {
  //     throw new Error('Incorrect number of arguments. Expecting id ex: OFFER-0-99');
  //   }
  //   let id = args[0];
  //   let assetAsBytes = await stub.getState(id); //get the asset from chaincode state
  //   if (!assetAsBytes || assetAsBytes.toString().length <= 0) {
  //     throw new Error(id + ' does not exist: ');
  //   }
  //   console.log(assetAsBytes.toString());
  //   return assetAsBytes;
  // }

  // async _queryAllAssets(stub, args) {

  //   let startKey = args[0]; // example: 'OFFER0'
  //   let endKey = args[1];   // example: 'OFFER999'
  //   let iterator = await stub.getStateByRange(startKey, endKey);

  //   let allResults = [];
  //   while (true) {
  //     let res = await iterator.next();

  //     if (res.value && res.value.value.toString()) {
  //       let jsonRes = {};
  //       console.log(res.value.value.toString('utf8'));

  //       jsonRes.Key = res.value.key;
  //       try {
  //         jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
  //       } catch (err) {
  //         console.log(err);
  //         jsonRes.Record = res.value.value.toString('utf8');
  //       }
  //       allResults.push(jsonRes);
  //     }
  //     if (res.done) {
  //       console.log('end of data');
  //       await iterator.close();
  //       console.info(allResults);
  //       return Buffer.from(JSON.stringify(allResults));
  //     }
  //   }
  // }


  /// start rich query section

  // ===============================================
  // readAsset - read an asset from chaincode state
  // ===============================================
  async readAsset(stub, args, thisClass) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting id ');
    }

    let id = args[0];
    if (!id) {
      throw new Error(' asset id must not be empty');
    }
    let assetAsbytes = await stub.getState(id); //get the asset from chaincode state
    if (!assetAsbytes.toString()) {
      let jsonResp = {};
      jsonResp.Error = 'Asset does not exist: ' + id;
      throw new Error(JSON.stringify(jsonResp));
    }
    console.info('=======================================');
    console.log(assetAsbytes.toString());
    console.info('=======================================');
    return assetAsbytes;
  }



  // ===========================================================================================
  // getAssetsByRange performs a range query based on the start and end keys provided.

  // Read-only function results are not typically submitted to ordering. If the read-only
  // results are submitted to ordering, or if the query is used in an update transaction
  // and submitted to ordering, then the committing peers will re-execute to guarantee that
  // result sets are stable between endorsement time and commit time. The transaction is
  // invalidated by the committing peers if the result set has changed between endorsement
  // time and commit time.
  // Therefore, range queries are a safe option for performing update transactions based on query results.
  // ===========================================================================================
  async getAssetsByRange(stub, args, thisClass) {

    if (args.length < 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let startKey = args[0];
    let endKey = args[1];

    let resultsIterator = await stub.getStateByRange(startKey, endKey);
    let method = thisClass['getAllResults'];
    let results = await method(resultsIterator, false);

    return Buffer.from(JSON.stringify(results));
  }


  // ===== Example: Parameterized rich query =================================================
  // queryAssetsByStatus queries for assets based on a passed in owner.
  // This is an example of a parameterized query where the query logic is baked into the chaincode,
  // and accepting a single query parameter (owner).
  // Only available on state databases that support rich query (e.g. CouchDB)
  // =========================================================================================
  async queryAssetsByStatus(stub, args, thisClass) {
    //   0
    // 'bob'
    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting owner name.')
    }

    let status = args[0];
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'offer';
    queryString.selector.status = status;
    let method = thisClass['getQueryResultForQueryString'];
    let queryResults = await method(stub, JSON.stringify(queryString), thisClass);
    return queryResults; //shim.success(queryResults);

  }

  // ===== Example: Ad hoc rich query ========================================================
  // queryAssets uses a query string to perform a query for assets.
  // Query string matching state database syntax is passed in and executed as is.
  // Supports ad hoc queries that can be defined at runtime by the client.
  // If this is not desired, follow the queryAssetsForOwner example for parameterized queries.
  // Only available on state databases that support rich query (e.g. CouchDB)
  // =========================================================================================
  async queryAssets(stub, args) {
   return 1; // place holder
  }

  async getAllResults(iterator, isHistory) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }

  // =========================================================================================
  // getQueryResultForQueryString executes the passed in query string.
  // Result set is built and returned as a byte array containing the JSON results.
  // =========================================================================================
  async getQueryResultForQueryString(stub, args) {

    let queryString = args[0];

    console.info('- getQueryResultForQueryString queryString:\n' + queryString)

    let iterator = await stub.getQueryResult(queryString);
    console.info('- getQueryResultForQueryString iterator:\n' + iterator)
    //let iterator = await stub.getHistoryForKey(id);
    let isHistory = false;   
    
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      //JAL, 111118 
//      console.log('Res = ' + res);
 //     console.log('Res value = ' + res.value);
  //    console.log('Res value value (to String) = ' + res.value.value.toString());

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};

	//JAL, 111118
   // 	console.info('Res value = ' + res.value);
    //	console.info('Res value key = ' + res.value.key);
    //	console.info('Res value value = ' + res.value.value);
    //	console.info('Res value value (to String utf8) = ' + res.value.value.toString('utf8'));

        //console.log(res.value.value.toString('utf8'));
        //jsonRes.Key = res.value.key;
        try {
            //jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
            jsonRes = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
            console.log(err);
            //jsonRes.Record = res.value.value.toString('utf8');
            jsonRes = res.value.value.toString('utf8');
          }
        
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    } 

    return Buffer.from(JSON.stringify(allResults));
  }

  /*
  with meta data , things like isDelete and in Key/Record format
  */
 async getQueryResultForQueryStringKeyRecord(stub, args) {

  let queryString = args[0];

  console.info('- getQueryResultForQueryString queryString:\n' + queryString)

  let iterator = await stub.getQueryResult(queryString);
  //let iterator = await stub.getHistoryForKey(id);
  let isHistory = false;   
  
  let allResults = [];
  while (true) {
    let res = await iterator.next();

    if (res.value && res.value.value.toString()) {
      let jsonRes = {};
      console.log(res.value.value.toString('utf8'));

      if (isHistory && isHistory === true) {
        jsonRes.TxId = res.value.tx_id;
        jsonRes.Timestamp = res.value.timestamp;
        jsonRes.IsDelete = res.value.is_delete.toString();
        try {
          jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Value = res.value.value.toString('utf8');
        }
      } else {
        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
      }
      allResults.push(jsonRes);
    }
    if (res.done) {
      console.log('end of data');
      await iterator.close();
      console.info(allResults);
      return Buffer.from(JSON.stringify(allResults));
    }
  } 

  return Buffer.from(JSON.stringify(allResults));
}



 /*
 methode: getHistoryForAsset
 */ 
  async getHistoryForAsset(stub, args, thisClass) {

    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting 1')
    }
    let id = args[0];
    console.info('- start getHistoryForAsset: %s\n', id);

    let iterator = await stub.getHistoryForKey(id);
    let isHistory = true;   
    
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    } 

    
  }


// end rich query section


// start asset modification/update section

  // ===========================================================
  // update a asset by setting its new json data
  // this is powerfull for two reasons: 
  // Generic: abstration of the sub (or sub.sub, etc ) attributes that is updated
  // Faster: we don't have to cll the update for ech attribute changed, example 10 attribues changes (status, description, etc ...) all updated in one call
  // ===========================================================
  
  async updateAsset(stub, args) {
    console.info('============= START : updateAsset ===========');

    let jsonData = JSON.parse(args); // this is the asset record in JSON format
    
    console.info(`=============debug jsonID =========== ${jsonData.id}`);
    await stub.putState(jsonData.id, Buffer.from(JSON.stringify(jsonData)));
    console.info('============= END : updateAsset ===========');
  }

  
  // async updateAsset(stub, args) {

  //   console.info('============= START : updateAsset(info) ===========');
  //   console.log ('============= START : updateAsset(log) ===========');

  //   if (args.length < 1) {
  //     throw new Error('Incorrect number of arguments. Expecting the modified record as argument')
  //   }
  

  //   console.log('...............update A..........');
  //   //let id = args[0].id;
  //   let updatedRecord = args[0];

  //   let id = updatedRecord.id;

  //   if (!id) {
  //     throw new Error('id must not be empty..');
  //   }
     
  //   console.log('...............update B..........');

  //   console.log('- start updateAsset ', id, updatedRecord);

  //   let assetAsBytes = await stub.getState(id);
  //   if (!assetAsBytes || !assetAsBytes.toString()) {
  //     throw new Error('asset does not exist');
  //   }
  //   let assetToTransfer = {};
  //   try {
  //     assetToTransfer = JSON.parse(assetAsBytes.toString()); //unmarshal
  //   } catch (err) {
  //     let jsonResp = {};
  //     jsonResp.error = 'Failed to decode JSON of: ' + id;
  //     throw new Error(jsonResp);
  //   }

  //   //console.info(assetToTransfer);
  //   //assetToTransfer.owner = newOwner; //change the owner
  //   console.log('...............update Z..........');
  //   console.log(id);

  //   let assetJSONasBytes = Buffer.from(JSON.stringify(updatedRecord));
  //   await stub.putState(id, updatedRecord); //rewrite the asset


  //   console.log('- end transferAsset (success)');
  // }


  // async transferAssetsBasedOnColor(stub, args, thisClass) {

  //   //   0       1
  //   // 'color', 'bob'
  //   if (args.length < 2) {
  //     throw new Error('Incorrect number of arguments. Expecting color and owner');
  //   }

  //   let color = args[0];
  //   let newOwner = args[1].toLowerCase();
  //   console.info('- start transferAssetsBasedOnColor ', color, newOwner);

  //   // Query the color~name index by color
  //   // This will execute a key range query on all keys starting with 'color'
  //   let coloredAssetResultsIterator = await stub.getStateByPartialCompositeKey('color~name', [color]);

  //   let method = thisClass['transferAsset'];
  //   // Iterate through result set and for each asset found, transfer to newOwner
  //   while (true) {
  //     let responseRange = await coloredAssetResultsIterator.next();
  //     if (!responseRange || !responseRange.value || !responseRange.value.key) {
  //       return;
  //     }
  //     console.log(responseRange.value.key);

  //     // let value = res.value.value.toString('utf8');
  //     let objectType;
  //     let attributes;
  //     ({
  //       objectType,
  //       attributes
  //     } = await stub.splitCompositeKey(responseRange.value.key));

  //     let returnedColor = attributes[0];
  //     let returnedAssetName = attributes[1];
  //     console.info(util.format('- found a asset from index:%s color:%s name:%s\n', objectType, returnedColor, returnedAssetName));

  //     // Now call the transfer function for the found asset.
  //     // Re-use the same function that is used to transfer individual assets
  //     let response = await method(stub, [returnedAssetName, newOwner]);
  //   }

  //   let responsePayload = util.format('Transferred %s assets to %s', color, newOwner);
  //   console.info('- end transferAssetsBasedOnColor: ' + responsePayload);
  // }

// end asset modification/update section


};

shim.start(new Chaincode());
