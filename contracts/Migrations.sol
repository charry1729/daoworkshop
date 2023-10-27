// SPDX-License-Identifier: MIT
pragma solidity >=0.8.1;

contract Migrations {
  address public owner;              // Address of the contract owner

  // Last completed migration is initially set to 2

  uint256 public last_completed_migration; // Last completed migration step

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  constructor() {
    owner = msg.sender;// Set the contract owner as the sender of the deployment transaction
  }

  function setCompleted(uint completed) public restricted {
    // If a function call sets completed to 3, last_completed_migration is updated to 3.
    last_completed_migration = completed; // Update the last_completed_migration variable
  }

  function upgrade(address new_address) public restricted {

    // Suppose new_address is the address of another instance of the Migrations contract.

    Migrations upgraded = Migrations(new_address);  // Create a new Migrations contract at the specified address new_address
    upgraded.setCompleted(last_completed_migration); // Set its last_completed_migration to the current value say 3
  }
}

