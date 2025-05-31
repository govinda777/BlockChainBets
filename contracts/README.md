# BlockchainBets Smart Contract Development Environment

This directory contains the Foundry project for the BlockchainBets smart contracts.

## BettingSystem.sol: Core Betting Contract

The `BettingSystem.sol` smart contract is the heart of the BlockchainBets platform's on-chain operations. It provides a transparent and immutable way for users to place bets on various events using the native cryptocurrency of the Base blockchain (ETH).

### Purpose and Design Philosophy

The primary purpose of `BettingSystem.sol` is to:
1.  Securely receive and record bets from users.
2.  Store essential details of each bet in a structured manner.
3.  Emit events that allow off-chain services to track and index betting activity.

The design prioritizes clarity, gas efficiency for common operations (like placing a bet), and extensibility for future features. It serves as the foundational layer for recording bets, while relying on off-chain components for aspects like event creation, user interface, metadata storage (IPFS), and advanced querying (The Graph).

### Key Features

*   **Native Currency Betting:** Bets are placed using ETH, making it accessible for users on the Base network. The `placeBet` function is `payable`.
*   **Structured Bet Storage:** Bet details (user, amount, event ID, metadata CID) are stored in a `Bet` struct. These are organized in a mapping `bets` keyed by `eventId`.
*   **Event-Driven Architecture:** A `NewBet` event is emitted upon every successful bet. This is crucial for off-chain services to build a real-time, queryable database of bets.
*   **Off-Chain Metadata:** Each bet links to a `metadataCID`, an IPFS Content ID. This points to a JSON object stored on IPFS, allowing for rich, flexible details about the bet (e.g., specific predictions, odds) without incurring high gas costs for on-chain storage.
*   **Bet Retrieval Function:** `getBetsByEventId(bytes32 eventId)` allows for on-chain retrieval of all bets for a given event, primarily useful for testing or simple contract-to-contract interactions.
*   **Comprehensive NatSpec Documentation:** The source code is thoroughly commented using Ethereum Natural Language Specification (NatSpec) for developers.

### How Betting Works (Lifecycle of a Bet)

The process of placing and recording a bet involves the following steps:

1.  **Event Definition (Off-Chain):** The BlockchainBets platform (off-chain) defines an event upon which users can bet (e.g., "Winner of Soccer Match: Team A vs. Team B"). This event is assigned a unique `eventId` (a `bytes32` value).
2.  **User Places a Bet (Frontend Interaction):**
    *   A user decides to bet on an event through the platform's frontend.
    *   The user specifies their prediction and the amount they wish to bet.
    *   The frontend prepares the transaction, including:
        *   The `eventId` for the chosen event.
        *   A `metadataCID`: The frontend constructs a JSON object with details of the user's specific bet (e.g., `{ "prediction": "Team A wins", "odds_taken": 2.5 }`), uploads this JSON to IPFS, and gets back a CID. This CID is the `metadataCID`.
        *   The `amount` the user wishes to bet (in wei).
3.  **Transaction Execution (`placeBet` function call):**
    *   The user (or the frontend on their behalf) calls the `placeBet` function on the `BettingSystem.sol` contract.
    *   The call includes `eventId`, `metadataCID`, the `amount` (as a parameter), and the actual ETH being bet (sent as `msg.value`).
4.  **Contract Validation:**
    *   The `placeBet` function first checks if `msg.value` (the ETH sent) is greater than or equal to the `amount` parameter. If not, the transaction reverts.
5.  **Storing the Bet:**
    *   A new `Bet` struct is created with:
        *   `user`: `msg.sender` (the address of the bettor).
        *   `amount`: `msg.value` (the actual ETH amount sent).
        *   `eventId`: The provided `eventId`.
        *   `metadataCID`: The provided `metadataCID`.
    *   This `Bet` struct is added to the array of bets associated with the `eventId` in the `bets` mapping.
6.  **Event Emission:**
    *   The contract emits a `NewBet` event containing all the details of the newly stored bet (`user`, `eventId`, `amount`, `metadataCID`).
7.  **Off-Chain Indexing:**
    *   Off-chain services, such as an indexer for The Graph, listen for `NewBet` events.
    *   When an event is detected, the indexer processes and stores the bet data in a way that can be efficiently queried by the frontend (e.g., to display lists of bets, user history, etc.).

### Understanding `eventId` and `metadataCID`

These two parameters are crucial for linking on-chain transactions with off-chain context:

*   **`eventId` (bytes32):**
    *   This is a generic `bytes32` identifier that the platform's backend or administrative process defines for each distinct betting market or question.
    *   Examples: `keccak256("soccer:match_123:winner")`, `keccak256("crypto_price:BTC_USD_Dec2024:above_100k")`.
    *   It allows the contract to group all bets related to the same market. The contract itself is agnostic to what the `eventId` *means*; this interpretation is handled by the platform.

*   **`metadataCID` (string):**
    *   This is an IPFS Content Identifier (CID). It acts as a pointer to a JSON file stored on IPFS.
    *   **Why IPFS?** Storing complex bet details (like user predictions, chosen odds, textual descriptions) directly on the blockchain would be very expensive due_to gas costs. IPFS provides a decentralized and immutable way to store this data off-chain.
    *   **Example JSON content for a `metadataCID`:**
        ```json
        {
          "event_name": "World Cup Final: France vs. Brazil",
          "user_prediction": "Brazil to win 2-1",
          "odds_taken": "3.50",
          "timestamp": "2024-07-26T10:30:00Z",
          "additional_notes": "User is a long-time Brazil supporter."
        }
        ```
    *   By storing only the CID on-chain, the contract remains lightweight, while rich, verifiable data can be associated with each bet.

### Interacting with the Contract

While users will typically interact with `BettingSystem.sol` through the BlockChainBets platform's frontend, developers or advanced users can interact with it directly:

*   **Placing Bets:** Using tools like Foundry's `cast`, Hardhat's console, or libraries like Ethers.js/Viem in a script. One would call the `placeBet` function, providing the necessary parameters and sending ETH (`msg.value`).
*   **Querying Bets:**
    *   The `getBetsByEventId(bytes32 eventId)` function can be called to retrieve an array of all bets for a specific event directly from the contract.
    *   For more complex queries (e.g., all bets by a user, bets within a certain amount range), it's expected to use the data indexed by The Graph (which consumes `NewBet` events).
    *   The public `bets` mapping also allows fetching a single bet by `eventId` and its index in the array, e.g., `bets(someEventId, 0)`.

### Current Limitations and Future Considerations

This initial version of `BettingSystem.sol` provides a solid foundation, but has certain limitations that open avenues for future development:

*   **ETH-Only Bets:** Only accepts native ETH for betting. Support for various ERC20 tokens is a common feature request for betting platforms.
*   **No Event Resolution:** The contract does not currently have logic to determine the outcome of an event (e.g., who won a match). This is typically handled by oracles or a trusted administrative process off-chain, which would then potentially trigger payout functions.
*   **No Prize Distribution:** Logic for calculating and distributing winnings is not yet implemented. This would be a critical component tied to event resolution.
*   **Gas Costs for `getBetsByEventId`:** While useful, fetching large arrays of bets directly from the chain via `getBetsByEventId` can be gas-intensive for the caller. This reinforces the importance of off-chain indexing for frontend data needs.
*   **Security Considerations:**
    *   The current `placeBet` function is relatively simple and does not appear to have immediate reentrancy vulnerabilities as it follows a checks-effects-interactions pattern (check `require`, effect `push` to storage, interaction `emit`).
    *   Future additions, especially those involving external calls or token interactions (like ERC20 transfers for prizes), will require careful security auditing (reentrancy guards, adherence to best practices).
    *   The use of `msg.value` directly as the bet amount is a design choice for simplicity. Care must be taken by frontends to ensure the `amount` parameter and `msg.value` are consistent with user intent.

This contract is a starting point, and its evolution will be driven by the platform's needs and community feedback.

---

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
