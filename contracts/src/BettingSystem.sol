// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title BettingSystem Contract
 * @author BlockchainBets Development Team (Jules)
 * @notice This smart contract provides the core functionality for the BlockChainBets platform,
 * enabling users to place bets on various events using the native blockchain currency (e.g., ETH).
 * It records each bet's details and emits an event that off-chain services can monitor.
 * @dev This is Version 1.0 of the BettingSystem contract. It focuses on the fundamental
 * betting mechanism: placing a bet and recording its essential details.
 * Key design considerations for this version include simplicity, gas efficiency for core operations,
 * and clear event emission for off-chain indexing.
 * Future iterations are planned to introduce features such as support for ERC20 token bets,
 * automated event resolution (e.g., through oracles), and prize distribution logic.
 * The contract currently relies on off-chain components for event creation, metadata management (via IPFS),
 * and user interface interactions.
 */
contract BettingSystem {
    /**
     * @dev The `using SafeERC20 for IERC20;` directive is included to facilitate potential future
     * integration of ERC20 token betting. `SafeERC20` provides wrappers around ERC20 calls that
     * revert on failure, enhancing security when interacting with various ERC20 token contracts.
     * In the current version, since bets are placed using native ETH (via `payable` functions),
     * these SafeERC20 operations are not actively invoked. This is a forward-looking inclusion.
     */
    using SafeERC20 for IERC20;

    /**
     * @notice Represents the details of a single bet placed by a participant on a specific event.
     * @param user The blockchain address of the participant who placed this bet. This ensures
     * clear ownership and facilitates identification for potential future prize claims.
     * @param amount The monetary value of the bet, recorded in wei (the smallest unit of Ether).
     * For native ETH bets, this is derived from `msg.value`.
     * @param eventId A unique `bytes32` identifier representing the specific event or market
     * the bet is placed on (e.g., a specific sports match, a prediction market outcome).
     * This ID is defined and managed by the off-chain platform logic.
     * @param metadataCID A string representing the IPFS Content Identifier (CID). This CID points to
     * an immutable JSON object stored on IPFS, containing detailed off-chain metadata about the bet.
     * This metadata might include the user's specific prediction (e.g., "Team A to win"),
     * the odds at which the bet was placed, timestamps, or other relevant contextual information
     * not stored directly on-chain to save gas and maintain flexibility.
     */
    struct Bet {
        address user;
        uint256 amount;
        bytes32 eventId;
        string metadataCID;
    }

    /**
     * @notice A mapping that stores all bets placed on the platform.
     * The key is the `eventId` (`bytes32`), and the value is an array of `Bet` structs,
     * representing all bets made for that specific event.
     * @dev This provides a straightforward way to group bets by event. While `public`, allowing
     * direct read access for simple on-chain queries (e.g., by other contracts, or for the
     * `getBetsByEventId` function), retrieving large arrays can be gas-intensive.
     * For efficient querying and frontend display, it is highly recommended to use an
     * off-chain indexing service (like The Graph) that listens to the `NewBet` events.
     * The public visibility generates a getter function that can retrieve individual `Bet` structs
     * by index (e.g., `bets(eventId, index)`), but not the entire array directly without a helper.
     */
    mapping(bytes32 => Bet[]) public bets;

    /**
     * @notice Emitted each time a new bet is successfully recorded by the `placeBet` function.
     * This event is crucial for off-chain services to track betting activity without needing
     * to constantly query contract state.
     * @param user The address of the bettor. Indexed to allow filtering for bets by a specific user.
     * @param eventId The identifier of the event on which the bet was placed. Indexed to allow
     * filtering for all bets related to a particular event.
     * @param amount The amount of the bet in wei.
     * @param metadataCID The IPFS CID associated with the bet's detailed metadata.
     */
    event NewBet(
        address indexed user,
        bytes32 indexed eventId,
        uint256 amount,
        string metadataCID
    );

    /**
     * @notice Retrieves all bets associated with a given `eventId`.
     * @param eventId The `bytes32` unique identifier for the event.
     * @return Bet[] An array of `Bet` structs, containing all bets placed for the specified event.
     * Returns an empty array if no bets have been placed for the event.
     * @dev This helper function was introduced because the default public getter for a mapping
     * of arrays (like `bets`) does not directly return the entire array. This function
     * simplifies access to all bets for an event, which can be useful for on-chain logic
     * (if needed by other contracts, though gas should be a consideration) and is particularly
     * handy for testing or simple off-chain scripts. For robust frontend data retrieval,
     * event indexing (via The Graph) is still the preferred method.
     */
    function getBetsByEventId(bytes32 eventId) external view returns (Bet[] memory) {
        return bets[eventId];
    }

    /**
     * @notice Allows a user to place a bet on a specific event by sending native currency (ETH).
     * @dev This function is marked `payable`, meaning it can receive ETH when called.
     * The core logic involves validating the sent ETH amount, creating a `Bet` struct with the
     * sender's address and other provided details, storing this struct, and emitting a `NewBet` event.
     * The `amount` parameter (uint256) is an intended bet amount specified by the user/frontend.
     * The contract ensures that `msg.value` (the actual ETH sent with the transaction)
     * is greater than or equal to this `amount`. The value stored in the `Bet` struct and
     * emitted in the `NewBet` event is `msg.value` itself. This design decision makes `msg.value`
     * the single source of truth for the transacted amount, simplifying accounting.
     * If `msg.value` is greater than the `amount` parameter, the current implementation includes
     * the entire `msg.value` as the bet. Refunding excess ETH was considered but omitted
     * in this version to save gas and complexity, under the assumption that frontends or users
     * will typically send the exact intended bet amount as `msg.value`.
     * @param eventId The `bytes32` identifier for the event the user is betting on. This must
     * correspond to an event known to the platform's off-chain systems.
     * @param metadataCID The IPFS Content ID (string) for the JSON metadata object associated
     * with this specific bet. This allows for rich, flexible off-chain data.
     * @param amount The intended bet amount in wei, as specified by the user or frontend.
     * This is used to validate against the `msg.value` sent with the transaction.
     * Requirements:
     * - `msg.value` (ETH sent with the transaction) must be greater than or equal to the `amount` parameter.
     *   If not, the transaction will revert with the error "BettingSystem: Insufficient ETH sent for the bet".
     * - `eventId` and `metadataCID` are expected to be valid and meaningful within the context
     *   of the broader BlockChainBets platform. The contract itself does not validate their format
     *   beyond their data types.
     */
    function placeBet(
        bytes32 eventId,
        string calldata metadataCID,
        uint256 amount
    ) external payable {
        require(msg.value >= amount, "BettingSystem: Insufficient ETH sent for the bet");

        bets[eventId].push(
            Bet({
                user: msg.sender,          // The user is the transaction sender
                amount: msg.value,         // The actual ETH amount sent is recorded
                eventId: eventId,          // The specified event identifier
                metadataCID: metadataCID   // The IPFS CID for bet-specific details
            })
        );

        emit NewBet(msg.sender, eventId, msg.value, metadataCID);
    }
}
