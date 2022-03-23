// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
  @notice make sure that state variables order are in sync, otherwise the storage allocation will messed up 
  @dev this contract is applicable for every contract that has state variables in the following order.
  
  Basically delegate call preserves the caller and value which means called contract will be run inside tha calle's context
  and updates the variable of the caller contract.
  
  The implementation will be use of that contract which is being called delegated. which make it easier to update the logics by the time
  without redeploying the contract that holds the state. best use case are those contracts that holds funds and they need to be updated.

*/
contract B {
  address public owner;
  uint256 public num;
  uint256 public amount;

  function setVariables(uint256 _num) external payable {
    num = _num * 2;
    amount = msg.value;
    owner = msg.sender;

  }

}


contract A {
  address public owner;
  uint256 public num;
  uint256 public amount;

  function setViaDelegate(address _contract, uint256 _num) external payable {
    (bool success, bytes memory data) = _contract.delegatecall(abi.encodeWithSignature("setVariables(uint256)", _num));
    require(success, "delegatecall failed");
  }
}