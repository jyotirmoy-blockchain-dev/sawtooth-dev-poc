const cbor = require('cbor');

const _decodeData = (buffer) =>
    new Promise((resolve, reject) =>
        cbor.decodeFirst(buffer, (err, obj) => (err ? reject(err) : resolve(obj)))
    )

module.exports = _decodeData;