// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

contract IsContract{
    function isContract (address _addr) external view returns (string memory) {
        return keccak256( _addr.code) != keccak256(bytes("")) ? "SM" : "EOA" ;
    }
}