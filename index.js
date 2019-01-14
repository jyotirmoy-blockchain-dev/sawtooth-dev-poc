const {TransactionProcessor} = require('sawtooth-sdk/processor');

const {Assethandler} = require('./processor/helper');

const VALIDATION_URL = 'tcp://localhost:4004';

//Add Transaction Processor Handler to TP
console.log(new Assethandler());
transactionProcessor = new TransactionProcessor(VALIDATION_URL);
transactionProcessor.addHandler(new Assethandler());
//Start Transaction Processor
transactionProcessor.start();
//Handle Stop Process
process.on('SIGUSR2', () => {
    transactionProcessor._handleShutdown();
})