const _createAddress = require('./_createAddress');
const _encodeData = require('./_encodeData');
const {
    InternalError,
    InvalidTransaction
} = require('sawtooth-sdk').exceptions;
const _storeAssset = (asset,owner,stateStore)=>{
    let address = _createAddress(asset,'00',64);

    // Check Data Already Exists
    return stateStore.get([address])
        .then((stateEntries) => {
            try {
                // decode the data
                //let decodedData = _decodeData(stateEntries[address]);
                // Check if data already exists
                if (stateEntries[address] && stateEntries[address].length > 0) {
                    throw new InvalidTransaction('Asset in use')
                }
                else{
                    // Encode the data to be saved to blockchain
                    let encodedData = _encodeData({name:asset,owner});
                    let entries = {
                        [address]: encodedData
                    };
                    // Save Information
                    stateStore.set(entries)
                        .then((dataAddress) => {
                            if (dataAddress.length < 1) {
                                throw new InternalError('State Error');
                            }
                            console.log(dataAddress, Data);
                        })
                }
            } catch (e) {
                throw new InternalError('Failed to get data' + e);
            }
        })
        .catch((err) => {
            let message = err.message ? err.message : err;
            throw new InternalError(message)
        });
    
    
}