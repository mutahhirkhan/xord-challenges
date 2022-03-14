// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "hardhat/console.sol";

contract TestMutation{
    uint256[] public amounts = [6 ether, 7 ether, 8 ether , 9 ether, 10 ether];
    uint256[] public arguments = [1 ether, 2 ether, 3 ether, 4 ether, 5];


    /**
     * @dev Mutates `amounts` by applying `mutation` with each entry in `arguments`.
     *
     * Equivalent to `amounts = amounts.map(mutation)`.
     */
    function add(uint256 a, uint256 b) public pure returns(uint256){
        return a + b;
    }

    function _mutateAmounts(
        uint256[] storage toMutate,
        uint256[] memory _arguments,
        function(uint256, uint256) pure returns (uint256) mutation
    ) internal  {
        for (uint8 i = 0; i < 5; ++i) {
            toMutate[i] = mutation(toMutate[i], _arguments[i]);
        }
    }

    function callMutation() external  {
        _mutateAmounts(amounts, arguments, add);
    }
    function traverseMutation() external view {
        for(uint256 i = 0; i< amounts.length; i++) {
            console.log(amounts[i]);
        }
    }
}