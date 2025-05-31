# BlockchainBets Smart Contract Development Environment

This directory contains the Foundry project for the BlockchainBets smart contracts.

## Current Status & Known Issues

A basic Foundry project structure has been initialized using `forge init --no-git --force`. This successfully set up the project and included the `forge-std` library.

**Dependency Installation Challenges:**

Attempts to install additional external dependencies, such as `OpenZeppelin/openzeppelin-contracts`, using `forge install <dependency_name> --no-commit` (or without `--no-commit`) have consistently failed within the current development environment.

The primary issue appears to be related to how the environment's tooling (specifically its internal Git post-processing steps) handles the creation of new, nested directories by the `forge install` command. When `forge install` creates directories for the new library (e.g., `lib/openzeppelin-contracts/`), subsequent internal checks seem to misinterpret these directories as files, leading to errors like:

`ValueError: Unexpected error: return_code: 1 stderr_contents: "cat: /app/contracts/lib/openzeppelin-contracts: Is a directory"`

This error suggests that a command like `cat` is being invoked on a directory path, which is invalid. This typically happens when Git commands (like `git diff` or `git add -A` which might be run internally by the tooling after a file operation) process the newly added library which might be seen as a submodule or a collection of untracked files and directories.

**Implications:**

This currently blocks the standard Foundry workflow for managing external dependencies. Workarounds, such as manually vendoring (copy-pasting) contract source code, might be necessary if the issue cannot be resolved at the environment level.

**Next Steps:**

The development of `BettingSystem.sol` will proceed, attempting to manually include necessary code from OpenZeppelin (like `IERC20.sol` and `SafeERC20.sol`) or by simplifying the contract to reduce external dependencies if manual inclusion proves too complex under these constraints.


## BettingSystem.sol Contract Overview

The `BettingSystem.sol` smart contract is the core on-chain component for the BlockchainBets platform. It allows users to place bets on various events and records these bets on the blockchain.

**Key Features:**

*   **Bet Placement:** Users can place bets on specific events by calling the `placeBet` function.
*   **Native Currency:** Currently, bets are placed using the native currency of the blockchain (e.g., ETH on Base Chain). The `placeBet` function is `payable`.
*   **Bet Storage:** Each bet, represented by a `Bet` struct (containing user address, amount, event ID, and a metadata CID), is stored in a mapping `bets` where the key is the `eventId`.
*   **Event Emission:** Upon successful bet placement, a `NewBet` event is emitted. This event includes details of the bet and can be used by off-chain services for indexing and tracking.
*   **Metadata:** Each bet includes a `metadataCID` (Content ID for IPFS). This CID points to a JSON object stored on IPFS that can contain further details about the bet, such as the specific outcome the user is betting on, odds at the time of the bet, etc.
*   **Bet Retrieval:** A helper function `getBetsByEventId(bytes32 eventId)` allows retrieval of all bets placed on a specific event.

**Current Implementation Details:**

*   The contract is written in Solidity ^0.8.20.
*   It utilizes manually vendored OpenZeppelin contracts for `IERC20` and `SafeERC20` interfaces/libraries (though `SafeERC20` is not actively used in the current native currency betting logic). This manual inclusion was necessary due to the dependency installation challenges detailed below.
*   Comprehensive NatSpec documentation is included within the contract code for better understanding and maintainability.

This contract serves as the foundation for recording bets. Future enhancements could include support for ERC20 token bets, automated event resolution, and prize distribution mechanisms.
