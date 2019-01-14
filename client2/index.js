const { EnclaveFactory } = require('./enclave')
const { SawtoothClientFactory } = require('./sawtooth-client')

const env = require('./env')
const input = require('./input')

const enclave = EnclaveFactory(Buffer.from(env.privateKey, 'hex'))

const intkeyClient = SawtoothClientFactory({
  enclave: enclave,
  restApiUrl: env.restApiUrl
})

const intkeyTransactor = intkeyClient.newTransactor({
  familyName: env.familyName,
  familyVersion: env.familyVersion
})

/* const newPayload = {
  Verb: argv.verb,
  Name: argv.name,
  Value: argv.value
} */
const payload = {
  action: 'create',
  asset: '1',
  owner: 'jyotirmoy'
};

if (input.payloadIsValid(payload)) {
  input.submitPayload(payload, intkeyTransactor)
} else {
  console.log(`Oops! Your payload failed validation and was not submitted.`)
}
