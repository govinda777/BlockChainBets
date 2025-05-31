// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {BettingSystem} from "../src/BettingSystem.sol";

contract BettingSystemTest is Test {
    BettingSystem public bettingSystem;

    address alice = address(0x1);
    address bob = address(0x2);

    bytes32 constant EVENT_ID_1 = keccak256("event_1");
    bytes32 constant EVENT_ID_2 = keccak256("event_2");
    string constant METADATA_CID_1 = "ipfs://cid1";
    string constant METADATA_CID_2 = "ipfs://cid2";

    function setUp() public {
        bettingSystem = new BettingSystem();
        vm.deal(alice, 10 ether); // Give Alice some ETH
        vm.deal(bob, 5 ether);   // Give Bob some ETH
    }

    // Test successful bet placement
    function test_PlaceBet_Success() public {
        uint256 betAmount = 1 ether;

        // Alice places a bet
        vm.prank(alice);
        vm.expectEmit(true, true, true, true); // Check all indexed and non-indexed fields
        emit BettingSystem.NewBet(alice, EVENT_ID_1, betAmount, METADATA_CID_1);
        bettingSystem.placeBet{value: betAmount}(EVENT_ID_1, METADATA_CID_1, betAmount);

        BettingSystem.Bet[] memory eventBets = bettingSystem.getBetsByEventId(EVENT_ID_1);
        assertEq(eventBets.length, 1, "Should have one bet for EVENT_ID_1");
        assertEq(eventBets[0].user, alice, "Bet user should be Alice");
        assertEq(eventBets[0].amount, betAmount, "Bet amount mismatch");
        assertEq(eventBets[0].eventId, EVENT_ID_1, "Bet eventId mismatch");
        assertEq(eventBets[0].metadataCID, METADATA_CID_1, "Bet metadataCID mismatch");
    }

    // Test revert on insufficient funds (msg.value < amount parameter)
    // For this test, we make 'amount' param higher than msg.value
    function test_PlaceBet_InsufficientFundsRevert() public {
        uint256 msgValue = 0.5 ether;
        uint256 betAmountParam = 1 ether; // amount parameter is higher than msg.value

        vm.prank(alice);
        vm.expectRevert(
            bytes("BettingSystem: Insufficient ETH sent for the bet")
        );
        bettingSystem.placeBet{value: msgValue}(EVENT_ID_1, METADATA_CID_1, betAmountParam);
    }

    // Test revert on insufficient funds (amount parameter = 0 but value is also 0, should not revert)
    // This also tests placing a zero value bet where amount parameter is also zero.
    function test_PlaceBet_ZeroValueBet_ZeroAmountParam() public {
        uint256 betAmount = 0;

        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit BettingSystem.NewBet(alice, EVENT_ID_1, betAmount, METADATA_CID_1);
        bettingSystem.placeBet{value: betAmount}(EVENT_ID_1, METADATA_CID_1, betAmount);

        BettingSystem.Bet[] memory eventBets = bettingSystem.getBetsByEventId(EVENT_ID_1);
        assertEq(eventBets.length, 1, "Should have one bet for EVENT_ID_1 (zero value)");
        assertEq(eventBets[0].amount, 0, "Bet amount should be 0");
    }


    // Test multiple bets on the same event
    function test_PlaceBet_MultipleBetsSameEvent() public {
        uint256 aliceBetAmount = 1 ether;
        uint256 bobBetAmount = 0.5 ether;

        // Alice places a bet
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit BettingSystem.NewBet(alice, EVENT_ID_1, aliceBetAmount, METADATA_CID_1);
        bettingSystem.placeBet{value: aliceBetAmount}(EVENT_ID_1, METADATA_CID_1, aliceBetAmount);

        // Bob places a bet on the same event
        vm.prank(bob);
        vm.expectEmit(true, true, true, true);
        emit BettingSystem.NewBet(bob, EVENT_ID_1, bobBetAmount, METADATA_CID_2); // Different CID
        bettingSystem.placeBet{value: bobBetAmount}(EVENT_ID_1, METADATA_CID_2, bobBetAmount);

        BettingSystem.Bet[] memory eventBets = bettingSystem.getBetsByEventId(EVENT_ID_1);
        assertEq(eventBets.length, 2, "Should have two bets for EVENT_ID_1");
        assertEq(eventBets[0].user, alice, "First bet user should be Alice");
        assertEq(eventBets[0].amount, aliceBetAmount, "First bet amount mismatch");
        assertEq(eventBets[1].user, bob, "Second bet user should be Bob");
        assertEq(eventBets[1].amount, bobBetAmount, "Second bet amount mismatch");
    }

    // Test multiple bets on different events
    function test_PlaceBet_MultipleBetsDifferentEvents() public {
        uint256 aliceBetAmount = 1 ether;
        uint256 bobBetAmount = 2 ether;

        // Alice places a bet on EVENT_ID_1
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit BettingSystem.NewBet(alice, EVENT_ID_1, aliceBetAmount, METADATA_CID_1);
        bettingSystem.placeBet{value: aliceBetAmount}(EVENT_ID_1, METADATA_CID_1, aliceBetAmount);

        // Bob places a bet on EVENT_ID_2
        vm.prank(bob);
        vm.expectEmit(true, true, true, true);
        emit BettingSystem.NewBet(bob, EVENT_ID_2, bobBetAmount, METADATA_CID_2);
        bettingSystem.placeBet{value: bobBetAmount}(EVENT_ID_2, METADATA_CID_2, bobBetAmount);

        BettingSystem.Bet[] memory event1Bets = bettingSystem.getBetsByEventId(EVENT_ID_1);
        assertEq(event1Bets.length, 1, "Should have one bet for EVENT_ID_1");
        assertEq(event1Bets[0].user, alice, "EVENT_ID_1 bet user should be Alice");

        BettingSystem.Bet[] memory event2Bets = bettingSystem.getBetsByEventId(EVENT_ID_2);
        assertEq(event2Bets.length, 1, "Should have one bet for EVENT_ID_2");
        assertEq(event2Bets[0].user, bob, "EVENT_ID_2 bet user should be Bob");
    }
}
