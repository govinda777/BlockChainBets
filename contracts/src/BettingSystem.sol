// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title BettingSystem
 * @author BlockchainBets Development Team (Jules)
 * @notice This contract allows users to place bets on predefined events using native currency (ETH).
 * It stores bet information and emits an event for each new bet.
 * @dev This is an initial version focusing on core betting logic.
 * Future versions might include ERC20 support, prize distribution, and event resolution.
 */
contract BettingSystem {
    // @dev SafeERC20 is included for potential future use with ERC20 tokens.
    // Currently, the contract primarily handles native ETH bets via payable functions,
    // so SafeERC20 operations are not actively used.
    using SafeERC20 for IERC20;

    /**
     * @notice Represents a single bet placed by a user.
     * @param user The address of the user who placed the bet.
     * @param amount The amount of currency (ETH in the current version) bet.
     * @param eventId A unique identifier for the event being bet on.
     * @param metadataCID An IPFS Content ID (CID) pointing to off-chain metadata for the bet (e.g., user selections, odds).
     */
    struct Bet {
        address user;
        uint256 amount;
        bytes32 eventId;
        string metadataCID;
    }

    /**
     * @notice Stores all bets placed, mapping an event identifier to an array of Bet structs.
     * @dev Public visibility allows direct read access for simple queries, but complex queries
     * should rely on indexed data (e.g., via The Graph) or dedicated getter functions.
     */
    mapping(bytes32 => Bet[]) public bets;

    /**
     * @notice Emitted when a new bet is successfully placed.
     * @param user The address of the user who placed the bet (indexed for filtering).
     * @param eventId The unique identifier for the event (indexed for filtering).
     * @param amount The amount of currency bet.
     * @param metadataCID The IPFS CID for the bet's metadata.
     */
    event NewBet(
        address indexed user,
        bytes32 indexed eventId,
        uint256 amount,
        string metadataCID
    );

    /**
     * @notice Returns all bets placed for a specific event.
     * @param eventId The unique identifier for the event.
     * @return Bet[] An array of Bet structs associated with the given eventId.
     * @dev This function was added to facilitate easier retrieval of bets for an event,
     * especially useful for off-chain services and testing.
     */
    function getBetsByEventId(bytes32 eventId) external view returns (Bet[] memory) {
        return bets[eventId];
    }

    /**
     * @notice Allows a user to place a bet on a specific event using native currency (ETH).
     * @dev The `amount` parameter is used to validate against `msg.value`. The actual amount
     * stored and emitted in the event is `msg.value`. This design ensures that the contract
     * correctly accounts for the exact ETH amount transferred.
     * @param eventId The unique identifier for the event on which the bet is being placed.
     * @param metadataCID The IPFS CID for metadata associated with this specific bet (e.g., specific outcome predicted).
     * @param amount The intended bet amount in wei. `msg.value` must be >= this amount.
     * Requirements:
     * - `msg.value` must be greater than or equal to the `amount` parameter specified.
     */
    function placeBet(
        bytes32 eventId,
        string calldata metadataCID,
        uint256 amount
    ) external payable {
        require(msg.value >= amount, "BettingSystem: Insufficient ETH sent for the bet");

        // Store the bet with msg.value as the actual amount transacted.
        bets[eventId].push(
            Bet({
                user: msg.sender,
                amount: msg.value, // Storing the actual ETH value sent
                eventId: eventId,
                metadataCID: metadataCID
            })
        );

        emit NewBet(msg.sender, eventId, msg.value, metadataCID);

        // Note on handling msg.value > amount:
        // The current implementation uses msg.value as the bet amount if msg.value >= amount.
        // If msg.value > amount, the excess is effectively included in the bet.
        // An alternative would be to refund the difference:
        // if (msg.value > amount) {
        //     payable(msg.sender).transfer(msg.value - amount);
        // }
        // However, this adds complexity and gas cost. The current approach is simpler,
        // assuming users send the exact intended bet amount as msg.value.
    }
}
