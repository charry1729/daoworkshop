// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * DAO contract:
 * 1. Collects investors money (ether)
 * 2. Keep track of investor contributions with shares
 * 3. Allow investors to transfer shares
 * 4. allow investment proposals to be created and voted
 * 5. execute successful investment proposals (i.e send money)
 */

contract DAO2 {
  mapping(address => bool) public investors;


  //   investors[0xAddress1] = true; // Address1 is an investor
  // investors[0xAddress2] = true; // Address2 is an investor
  // investors[0xAddress3] = false; // Address3 is not an investor
  // investors[0xAddress4] = true; // Address4 is an investor


  mapping(address => uint) public shares;


//   shares[0xInvestor1] = 1000; // Investor1 holds 1000 shares
// shares[0xInvestor2] = 500; // Investor2 holds 500 shares
// shares[0xInvestor3] = 2000; // Investor3 holds 2000 shares
// shares[0xInvestor4] = 250; // Investor4 holds 250 shares


  uint public totalShares;
  uint public availableFunds;
  uint public contributionEnd;

  constructor(uint contributionTime)  {
    contributionEnd = block.timestamp + contributionTime;
  }

  function contribute() payable external {
    require(block.timestamp < contributionEnd, 'cannot contribute after contributionEnd');
    investors[msg.sender] = true;
    shares[msg.sender] += msg.value;
    totalShares += msg.value;
    availableFunds += msg.value;
  }
}
