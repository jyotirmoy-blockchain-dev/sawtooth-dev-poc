const crypto = require('crypto');
// Creating the new address
const NAMESPACE = 'intkey-family';
const _createAddress = (Name,vers,length=64) => {
    let prefix = NAMESPACE;
    let newHash = crypto.createHash('sha512').update(gameName).digest('hex').toLowerCase();
    return prefix + vers + newHash.substring(0, length);
}

module.exports = _createAddress;