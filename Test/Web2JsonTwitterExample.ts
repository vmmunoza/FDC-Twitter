// scripts/fdcExample/Web2JsonTwitterExample.ts
import 'dotenv/config';
import { web3 } from 'hardhat';
import {
  prepareAttestationRequestBase,
  submitAttestationRequest,
  retrieveDataAndProofBaseWithRetry
} from './Base';

const {
  WEB2JSON_VERIFIER_URL_TESTNET,
  VERIFIER_API_KEY_TESTNET,
  COSTON2_DA_LAYER_URL,
  TWITTER_BEARER_TOKEN,
} = process.env;

if (
  !WEB2JSON_VERIFIER_URL_TESTNET ||
  !VERIFIER_API_KEY_TESTNET ||
  !COSTON2_DA_LAYER_URL ||
  !TWITTER_BEARER_TOKEN
) throw new Error('Missing env var');

// — API call parameters —
const apiUrl      = 'https://api.twitter.com/2/users/by/username/0xQuantic';
const httpMethod  = 'GET';
const headers     = JSON.stringify({
  Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
  'User-Agent': 'flare-web2json-demo/1.0',
  Accept: 'application/json'
});
const queryParams = '';  
const body        = '';         

// jq query to extract specific fields from the Twitter API response
const postProcessJq = '{ id: .data.id, name: .data.name, username: .data.username }';

// ABI signature defining the structure of the data we expect
const abiSignature = `{
  "components":[
    {"internalType":"string","name":"id","type":"string"},
    {"internalType":"string","name":"name","type":"string"},
    {"internalType":"string","name":"username","type":"string"}
  ],
  "name":"task",
  "type":"tuple"
}`;

/**
 * Prepares the attestation request
 */
async function prepare() {
  console.log('Preparing request with params:', {
    url: apiUrl,
    headers: JSON.parse(headers),
    queryParams,
    body
  });

  return prepareAttestationRequestBase(
    `${WEB2JSON_VERIFIER_URL_TESTNET}Web2Json/prepareRequest`,
    VERIFIER_API_KEY_TESTNET!,
    'Web2Json',
    'PublicWeb2',
    { url: apiUrl, httpMethod, headers, queryParams, body, postProcessJq, abiSignature }
  );
}

/**
 * Fetches the proof for the attestation request
 */
async function fetchProof(encoded: string, round: number) {
  console.log('DA Layer Request:', {
    url: `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`,
    request: {
      votingRoundId: round,
      requestBytes: encoded
    }
  });
  return retrieveDataAndProofBaseWithRetry(
    `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`,
    encoded,
    round
  );
}

// hexToString is not strictly needed if web3.eth.abi.decodeParameter works correctly for strings, but keeping it for context.
function hexToString(hex: string): string {
  hex = hex.replace('0x', '');
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.substr(i, 2), 16);
    if (byte !== 0) {
      str += String.fromCharCode(byte);
    }
  }
  return str;
}

/**
 * Main execution function
 */
(async () => {
  try {
    // Step 1: Prepare the attestation request
    console.log('Preparing attestation request...');
    const prep = await prepare();
    if (prep.status !== 'VALID') {
      console.error('Verifier returned invalid status:', prep);
      throw prep;
    }
    console.log('Attestation request prepared successfully');

    // Step 2: Submit the request to the network
    console.log('Submitting attestation request...');
    const roundId = await submitAttestationRequest(prep.abiEncodedRequest!);
    console.log('Attestation request submitted, roundId:', roundId);

    // Step 3: Fetch the proof
    console.log('Fetching proof...');
    const proof = await fetchProof(prep.abiEncodedRequest!, roundId);
    console.log('Proof received:', proof);

    // Step 4: Extract and decode the response data using web3.eth.abi.decodeParameter
    const tupleAbi = {
      components: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'username', type: 'string' },
      ],
      type: 'tuple',
    };
    const decoded = web3.eth.abi.decodeParameter(tupleAbi as any, proof.response_hex);

    // Display the decoded data
    console.log('✅ On-chain Twitter user:', {
      id: decoded.id,
      name: decoded.name,
      username: decoded.username
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
