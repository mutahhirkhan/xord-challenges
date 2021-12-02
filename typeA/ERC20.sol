// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Mutahhir {
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;

    mapping(address => uint) balance;

    // one coin owner allows another user to spend coins on its behalf
    // owner => recipient => remaining
    mapping(address => mapping(address => uint)) allowed;

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed from, address indexed to, uint256 value);

    constructor () {
        symbol = "MIT";
        name="Mutahhir";
        decimals = 8;
        _totalSupply= 100000000000000 ;
    }
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256){
        return balance[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(_to != address(0), "Mutahhir:: invalid address");
        require(balance[msg.sender] >= _value, "Mutahhir:: insufficient balance");
        balance[msg.sender] -= _value;
        balance[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(_to != address(0), "Mutahhir:: invalid address");
        require(balance[msg.sender] >= _value, "Mutahhir:: insufficient balance");
        balance[_from] -= _value;
        balance[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // recommends that there are no checks for the approval double-spend attack
    // as this should be implemented in user interfaces 
    function approve(address _spender, uint256 _value) public returns (uint allowedToSpend) {
        require(_spender != address(0), "Mutahhir:: invalid address");
        allowedToSpend = allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];

    }

}