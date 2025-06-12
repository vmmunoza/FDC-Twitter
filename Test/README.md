# Twitter-Web2Json-Test

This folder contains a script (`Web2JsonTwitterExample.ts`) that attempts to perform a Web2Json attestation for Twitter user data using the Flare FDC framework. It is configured to use the same API endpoint and headers that have been verified to work via direct API calls (see `../Fetch-Test/README.md`).

## Purpose

- Demonstrate a Web2Json attestation using the Twitter API (fetching user `0xQuantic`'s `id`, `name`, and `username`).
- Test the end-to-end flow of the Flare FDC attestation process for a real-world authenticated API.

## Prerequisites

- Node.js installed
- Hardhat installed in your project.
- **Environment Variables**: Ensure the following are set in your project's `.env` file:
    ```
    WEB2JSON_VERIFIER_URL_TESTNET=...
    VERIFIER_API_KEY_TESTNET=...
    COSTON2_DA_LAYER_URL=...
    TWITTER_BEARER_TOKEN=your_valid_twitter_bearer_token
    ```
    **Important**: The `TWITTER_BEARER_TOKEN` must be valid and have the necessary permissions (e.g., "read" access for users endpoint).

## How to Run

From your project's root directory:

```bash
yarn hardhat run fdcExample/Twitter-Web2Json-Test/Web2JsonTwitterExample.ts --network coston2
# or, if using npm:
# npx hardhat run fdcExample/Twitter-Web2Json-Test/Web2JsonTwitterExample.ts --network coston2
```


## Actual Issues Found

When running this script, the attestation process proceeds successfully up to the point of fetching the proof from the Data Availability (DA) Layer. However, it consistently fails with an error indicating the attestation request cannot be found by the DA layer.

### Observed Output


```bash
Preparing attestation request...
Preparing request with params: {
url: 'https://api.twitter.com/2/users/by/username/0xQuantic',
headers: {
Authorization: 'Bearer TWITTER_BEARER_TOKEN',
'User-Agent': 'flare-web2json-demo/1.0',
Accept: 'application/json'
},
queryParams: '',
body: ''
}
Url: https://web2json-verifier-test.flare.rocks/Web2Json/prepareRequest
Prepared request:
{
attestationType: '0x576562324a736f6e...',
sourceId: '0x5075626c696357656232...',
requestBody: {
url: 'https://api.twitter.com/2/users/by/username/0xQuantic',
httpMethod: 'GET',
headers: '{"Authorization":"Bearer TWITTER_BEARER_TOKEN","User-Agent":"flare-web2json-demo/1.0","Accept":"application/json"}',
queryParams: '',
body: '',
postProcessJq: '{ id: .data.id, name: .data.name, username: .data.username }',
abiSignature: '{\n "components":[...]}'
}
}
Response status is OK
Attestation request prepared successfully
Submitting attestation request...
Submitted request: 0x4799bf09d1b01061ad691f843047d8655e970b2a084489cac1a2f6f55b65aae8
Block timestamp: 1749635446n
First voting round start ts: 1658430000n
Voting epoch duration seconds: 90n
Calculated round id: 1013393
Received round id: 1013393
Check round progress at: https://coston2-systems-explorer.flare.rocks/voting-epoch/1013393?tab=fdc
Attestation request submitted, roundId: 1013393
Fetching proof...
DA Layer Request: {
url: 'https://ctn2-data-availability.flare.network/api/v1/fdc/proof-by-request-round-raw',
request: {
votingRoundId: 1013393,
requestBytes: '0x576562324a736f6e...'
}
}
DA layer response status: 400
DA layer response headers: Headers { ... }
DA layer error response: {"error":"attestation request not found"}
Error: Response status is not OK, status 400 Bad Request
at postRequestToDALayer (C:\Users\victo\Desktop\testHH\flare-hardhat-starter\scripts\fdcExample\Base.ts:152:15)
... (stack trace) ...
Remaining attempts: 10
```

The "attestation request not found" error, despite the successful submission of the attestation request onchain must be double-checked in the system explorer. 
