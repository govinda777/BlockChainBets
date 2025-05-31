// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Using remappings, so path should be @openzeppelin/
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract BettingSystem {
    using SafeERC20 for IERC20; // Applying SafeERC20 to IERC20 instances

    struct Bet {
        address user;
        uint256 amount;
        bytes32 eventId;
        string metadataCID; // IPFS Content ID for bet metadata
    }

    mapping(bytes32 => Bet[]) public bets; // Mapping from eventId to list of bets

    event NewBet(
        address indexed user,
        bytes32 indexed eventId,
        uint256 amount,
        string metadataCID
    );

    /**
     * @notice Returns all bets for a given eventId.
     * @param eventId The unique identifier for the event.
     * @return An array of Bet structs.
     */
    function getBetsByEventId(bytes32 eventId) external view returns (Bet[] memory) {
        return bets[eventId];
    }

    // Note: This contract itself won't hold ERC20 tokens for bets.
    // It expects users to have *approved* this contract to spend their tokens,
    // or for bets to be placed in native currency (ETH).
    // The current placeBet is designed for native currency (ETH) via payable.
    // If ERC20 tokens were to be used for bets, placeBet would need tokenAddress
    // and use safeTransferFrom. The ARQ.md mentioned `payable`, implying native currency.

    /**
     * @notice Places a bet on a specific event with native currency (ETH).
     * @param eventId The unique identifier for the event.
     * @param metadataCID The IPFS CID for metadata associated with this bet.
     * @param amount The amount of ETH being bet.
     *
     * Requirements:
     * - msg.value must be greater than or equal to the bet amount.
     */
    function placeBet(
        bytes32 eventId,
        string calldata metadataCID,
        uint256 amount // This amount is for record-keeping if msg.value is used directly
    ) external payable {
        require(msg.value >= amount, "BettingSystem: Insufficient ETH sent for the bet");

        // If we strictly want the 'amount' parameter to be the source of truth
        // and msg.value to only cover that amount (e.g., msg.value could be higher
        // and we only account for 'amount'), then the logic would be:
        // require(msg.value >= amount, "Insufficient ETH sent");
        // uint256 betAmountToStore = amount;
        // However, typically for payable functions, msg.value IS the amount.
        // The ARQ.md's contract snippet's placeBet was payable and took an 'amount'
        // param, with require(msg.value >= amount). This implies msg.value is the actual
        // value transferred and 'amount' is for matching/validation.
        // For clarity, if 'amount' from params is the bet's value, and msg.value is the payment,
        // they should typically be equal. Let's assume msg.value is the bet amount.

        bets[eventId].push(
            Bet({
                user: msg.sender,
                amount: msg.value, // Storing the actual ETH value sent
                eventId: eventId,
                metadataCID: metadataCID
            })
        );

        emit NewBet(msg.sender, eventId, msg.value, metadataCID);

        // If 'amount' parameter was different and there's excess msg.value,
        // it should ideally be refunded, e.g.:
        // if (msg.value > amount) {
        //     payable(msg.sender).transfer(msg.value - amount);
        // }
        // But the original spec and ARQ.md snippet imply msg.value is the bet.
    }
}
