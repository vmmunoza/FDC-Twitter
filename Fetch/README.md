# Fetch-Test

This folder contains a minimal script (`testFetch.ts`) to directly test Twitter API access using a Bearer token.  
It is intended as a baseline check to confirm that your credentials and network setup are correct before debugging more complex Flare FDC attestation flows.

## Purpose

- Verify that your Twitter Bearer token is valid.
- Confirm that your environment can reach the Twitter API.
- Ensure the request format and headers are correct.
- Provide a reference output for comparison with more complex scripts.

## Usage

1. **Install dependencies** (if not already done in your project root):
   ```bash
   yarn add node-fetch
   # or
   npm install node-fetch
   ```

2. **Set your Twitter Bearer token** in a `.env` file in the project root:
   ```
   TWITTER_BEARER_TOKEN=your_token_here
   ```

3. **Run the script:**
   ```bash
   npx hardhat run fdcExample/Fetch-Test/testFetch.ts
   # or
   yarn hardhat run fdcExample/Fetch-Test/testFetch.ts
   ```

## Expected Output

If everything is working, you should see output like:

```
200 {"data":{"id":"1439548673495547908","name":"Quantic","username":"0xQuantic"}}
```
