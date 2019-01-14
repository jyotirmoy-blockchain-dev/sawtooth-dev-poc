const {
    TransactionHandler
} = require('sawtooth-sdk/processor/handler');
const {
    InternalError,
    InvalidTransaction
} = require('sawtooth-sdk').exceptions;

const INTKEY_FAMILY = 'asset-family';
const INTKEY_VERSION = '1.0';
const _unpackTransaction = require('./lib/_unpackTransaction');
const _storeAsset = require('./lib/_storeAssset');
const _transferAsset = require('./lib/_transferAsset');
const {
    createHash
} = require('crypto');
const INT_NAMESPACE = createHash('sha512').update(INTKEY_FAMILY).digest('hex').slice(0, 6);


class Assethandler extends TransactionHandler{
    constructor () {
        super(INTKEY_FAMILY, [INTKEY_VERSION], [INT_NAMESPACE]);
        
    }    
    apply(transactionProcessRequest, statestore) {
        return _unpackTransaction(transactionProcessRequest)
        .catch((err) => {
            throw new InternalError(err);
        })
            .then((transactionData)=>{
                // Perform Action on asset based on action passed
                if(transactionData.action == 'create'){
                    return _storeAsset(transactionData.asset,transactionData.owner,statestore);
                    
                }
                if(transactionData.action == 'transfer'){
                    return _transferAsset(transactionData.asset,transactionData.owner,transactionData.signer,statestore);

                }
                throw new InvalidTransaction('Action is not valid');
            });
            
    }
}

module.exports = {Assethandler};