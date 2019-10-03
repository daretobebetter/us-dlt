
var express = require('express');
var router = express.Router();
var query = require('../blockchain/query.js');
var invoke = require('../blockchain/invoke.js');
// var invokeCreateBulk = require('../blockchain/invokeCreateBulk.js');
var updt = require('../blockchain/update.js');




/*
// Section 1. microservices interacting with acquisitions smart contract (asset.js)
// please note: This section should be always maintained/aligned with the requiremnent at UI side, or any other client API.
*/


router.get('/acquisition', (req, res, next) => {
    const requestAll = {
        chaincodeId: 'asset',
        fcn: 'getQueryResultForQueryString',
        args: ['{\"selector\":{}}']
    };

    console.log('inside the /aquisition route');

    query.query(requestAll).then(function (final_result) {

        const common = require('../lib/common');
        const ed = new common.EncryptDecrypt();
        // formating to meet client spec
        // console.log('final result: ' + final_result);
        result = JSON.parse(final_result);
        result = result.map(item => {
            if (item.data) {
                return JSON.parse(ed.decrypt(item.data));
            } else {
                return item;
            }
        });
        result.forEach(function (obj) { obj._id = obj.id; }); // adding the _id - as per the model expected by the client
        res.status(200).json(result);
    });


}
);


router.get('/acquisition/:id', (req, res, next) => {
    // sample call: http://18.207.167.245:6001/acquisition/ACQS-00-1
    let _id = req.params.id;

    var requestById = {
        //targets : --- (imp parameter) letting this default to the peers assigned to the channel ( MC: in our case supplychainchannel- to be used in case of multi channel)
        chaincodeId: 'asset',
        fcn: 'getQueryResultForQueryString',
        //args: ["{\"selector\":{\"_id\":\"ACQS-00-0\"}}"]
        args: ["{\"selector\":{\"_id\":\"" + _id + "\" }}"]
    };

    // debug: console.log("id: "+ _id);
    query.query(requestById).then(function (final_result) {

        const common = require('../lib/common');
        const ed = new common.EncryptDecrypt();
        // formating to meet client spec
        result = JSON.parse(final_result);
        result = result.map(item => {
            if (item.data) {
                return JSON.parse(ed.decrypt(item.data));
            } else {
                return item;
            }
        });
        result.forEach(function (obj) { obj._id = obj.id; }); // adding the _id - as per the model expected by the client
        result = result[0];
        res.status(200).json(result);

    });
}
);


router.get('/history/:id', (req, res, next) => {
    // sample call: http://18.207.167.245:6001/history/ACQS-00-1
    let _id = req.params.id;

    var requestById = {
        //targets : --- (imp parameter) letting this default to the peers assigned to the channel ( MC: in our case supplychainchannel- to be used in case of multi channel)
        chaincodeId: 'asset',
        fcn: 'getHistoryForAsset',
        //args: ["ACQS-00-0"]
        args: [_id]
    };

    // debug: console.log("id: "+ _id);
    query.query(requestById).then(function (final_result) {

        // formating to meet client spec
        result = JSON.parse(final_result);
        res.status(200).json(result);

    });
}
);



router.post('/acquisition/create', function (req, res, next) {
    //sample call: http://18.207.167.245:6001/acquisition/create  . call type: POST . body type: (raw - JSON (application/json)). body content: the asset as valid json object, e.g {"name":"Labs-99-9999","agency":"ABC",.....}
    var asset = req.body;
    if (!asset.id) {
        return res.status(400).send('acquisition must have id');
    }
    const common = require('../lib/common');
    const ed = new common.EncryptDecrypt();
    const encrypted = ed.encrypt(JSON.stringify(asset));
    const encryptPackage = { id: asset.id, data: encrypted };
    invoke.invoke(encryptPackage).then(function (err, data) {
        if (err) {
            res.send(err);
        }
        return res.send(data);
    });
});


//router.post('/acquisition/createBulk', function (req, res, next)  {
//
//    var asset=req.body;
//	// TODO: is asset array of acquisitions ?
//    const common = require('../lib/common');
//    const ed = new common.EncryptDecrypt();
//    invokeCreateBulk.invoke(asset).then( function(err, asset) {
//         if(err){
//          res.send(err);
//         }
//         res.status(200).json(asset);
//     });
//  }
// );





router.post('/acquisition/update', function (req, res, next) {
    var asset = req.body;
    // remove the fiels that is not accepted by CouchDb
    // Otherwise this error occurs: The field [_id] is not valid for the CouchDB state database
    delete asset._id;

    if (!asset.id) {
        return res.status(400).send('acquisition must have id');
    }
    const common = require('../lib/common');
    const ed = new common.EncryptDecrypt();
    const encrypted = ed.encrypt(JSON.stringify(asset));
    const encryptPackage = { id: asset.id, data: encrypted };

    // debug: console.info("Request body for the update: " + JSON.stringify(asset));
    updt.update(encryptPackage).then(function (err, asset) {
        if (err) {
            return res.send(err);
        }
        return res.send(asset);
    });
}
);


/*
// Section 2. Other microservices: Catalog and Seller/Vendor,  interacting with their respective smart contracts (namely seller.js and catalog.js)
// please note: This section should be always maintained/aligned with the requiremnent at UI side, or any other client API.
*/
router.post('/seller/create', function (req, res, next) {
    //sample call: http://18.207.167.245:6001/seller/create  . call type: POST . body type: (raw - JSON (application/json)). body content: a valid json object.
    var seller = req.body;
    if (!seller.id) {
        return res.status(400).send('seller must have id');
    }
    const common = require('../lib/common');
    const ed = new common.EncryptDecrypt();
    const encrypted = ed.encrypt(JSON.stringify(seller));
    const encryptPackage = { id: seller.id, data: encrypted };
    invoke.invoke(encryptPackage).then(function (err, seller) {
        if (err) {
            return res.send(err);
        }
        return res.send(seller);
    });
}
);


router.post('/catalog/create', function (req, res, next) {
    //sample call: http://18.207.167.245:6001/catalog/create  . call type: POST . body type: (raw - JSON (application/json)). body content: a valid json object.
    var catalog = req.body;
    if (!catalog.id) {
        return res.status(400).send('catalog must have id');
    }
    const common = require('../lib/common');
    const ed = new common.EncryptDecrypt();
    const encrypted = ed.encrypt(JSON.stringify(catalog));
    const encryptPackage = { id: catalog.id, data: encrypted };
    invoke.invoke(encryptPackage).then(function (err, catalog) {
        if (err) {
            return res.send(err);
        }
        return res.send(catalog);
    });
}
);




router.get('/', (req, res, next) => {
    res.status(200).json({ msg: 'Main page is working' })
}
);


module.exports = router;
