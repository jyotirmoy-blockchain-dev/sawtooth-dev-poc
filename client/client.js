const {
    createContext,
    CryptoFactory
} = require('sawtooth-sdk/signing');
const {createHash} = require('crypto');
const {protobuf} = require('sawtooth-sdk');
// Setting up keys for encoding transaction
const context = createContext('secp256k1');
const privateKey = context.newRandomPrivateKey();
const signer = (new CryptoFactory(context)).newSigner(privateKey)

// Encoding Payload

const cbor = require('cbor');
const payload = {
    action: 'create',
    asset: '1',
    owner: signer
};

const payloadBytes = cbor.encode(payload);

// Creating Transaction Header



const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: 'asset-family',
    familyVersion: '1.0',
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
}).finish();
//console.log(createHash('sha512').update('asset').digest('hex'));
// Create a complete transaction


const signature = signer.sign(transactionHeaderBytes);

const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
});

// Now we create the transaction Batch

// Create Batch Header
const transactions = [transaction];
const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
}).finish();

// Cteating the Batch

const signature_batch = signer.sign(batchHeaderBytes);

const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: signature_batch,
    transactions: transactions
});

// Create a batch list encoded

const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
})
.finish();

// sending the request
console.log(batchListBytes);
const request = require('request');
request.post({
url : 'http://localhost:8008/batches',
    body: batchListBytes,
    headers: {
        'Content-Type': 'application/octet-stream'
    },
}, (err, response) => {
    if (err) return console.log(err);
    console.log(response.body);
});