# FDC-Twitter: Flare FDC Web2Json Attestation Debugging Example

This repository contains a collection of minimal Hardhat scripts designed to debug and demonstrate the FDC Web2Json attestation framework, with a specific focus on integrating with the Twitter API.

It serves to illustrate successful attestation flows as well as to highlight and document challenges encountered with specific external APIs.

## Example Scripts

All example scripts were located in the `scripts/fdcExample/` directory. In this repo each has its own subfolder containing a dedicated `README.md` for detailed instructions and findings.

*   **[`Fetch`](https://github.com/vmmunoza/FDC-Twitter/blob/main/Fetch/README.md)**:
    A direct, minimal script to test connectivity and authentication with the Twitter API. **(Works: Confirms local Twitter API access and token validity)**

*   **[`Twitter-Web2Json-Test`](https://github.com/vmmunoza/FDC-Twitter/blob/main/Test/README.md)**:
    An FDC Web2Json attestation script for the Twitter API. This script *fails* during DA layer proof retrieval. 

## Main Challenge Identified

The primary issue discovered is with the **`Twitter-Web2Json-Test`** script, which consistently seems to fail at the DA Layer proof retrieval with the error `"attestation request not found"`.

*   **Confirmed**: Tge local Twitter API access and token are valid.
*   **Confirme ?**: The attestation request format is correct and accepted by the Flare verifier.
*   **Cause (?)**: Ptential timing, synchronization, or indexing issue within the Flare DA Layer itself, preventing it from recognizing freshly submitted attestations in a timely manner. 

