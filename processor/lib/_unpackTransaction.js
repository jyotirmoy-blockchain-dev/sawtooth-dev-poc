const {
    InternalError,
    InvalidTransaction
} = require('sawtooth-sdk').exceptions;
const {
    TransactionHeader
} = require('sawtooth-sdk/protobuf');

const _decodeData = require('./_decodeData');

const _unpackTransaction = (transaction) =>
    new Promise((resolve, reject) => {
        // Getting the transaction from client.js
        
        let header = TransactionHeader.decode(transaction.header);
        let signer = header.signerPublicKey;
        try{
            //let payloadArray = cbor.decodeFirst(transaction.payload);
            let payload = _decodeData(transaction.payload);
            console.log(payload);
            resolve({
                action:payload.action,
                asset:payload.asset,
                owner:payload.owner,
                header: header,
                signer: signer
            });
        }
        catch(err){
            let reason = new InvalidTransaction("Invalid payload data");
            reject(reason);
        }
    });

module.exports = _unpackTransaction;