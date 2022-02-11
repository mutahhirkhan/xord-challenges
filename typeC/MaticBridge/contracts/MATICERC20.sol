// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MutahhirERC20  is IERC20{
    string public symbol;
    string public  name;
    uint8 public decimals = 18;
    uint public override totalSupply = 10000000000;
    uint public _totalTokens;

 
    mapping(address => uint) balance;

    // mint event
    event Mint(address indexed to, uint256 value);
    // burn event
    event Burn(address indexed from, uint256 value);

    constructor (string memory  _name, string memory _symbol) {
        symbol = _symbol;
        name=_name;
    }

    // function balanceOf(address _owner) public view override returns (uint256){
    //     return balance[_owner];
    // }
    
    // //transfer function
    // function transfer(address _to, uint256 _value) public returns (bool){
    //     require(_to != address(0));
    //     require(_value <= balance[msg.sender]);
    //     require(_value <= _totalTokens);
    //     balance[msg.sender] = balance[msg.sender] - _value;
    //     balance[_to] = balance[_to] + _value;
    //     Transfer(msg.sender, _to, _value);
    //     return true;
    // }
    // //transferFrom function
    // function transferFrom(address _from, address _to, uint256 _value) public returns (bool){
    //     require(_to != address(0));
    //     require(_value <= balance[_from]);
    //     require(_value <= balance[_from]);
    //     require(_value <= _totalTokens);
    //     balance[_from] = balance[_from] - _value;
    //     balance[_to] = balance[_to] + _value;
    //     Transfer(_from, _to, _value);
    //     return true;
    // }
    // //allowance function 
    // function allowance(address _owner, address _spender) public view returns (uint256){
    //     return balances[_owner][_spender];
    // }
    // //approve function
    // function approve(address _spender, uint256 _value) public returns (bool){
    //     require(_value <= balance[msg.sender]);
    //     require(_value <= _totalTokens);
    //     balances[msg.sender][_spender] = _value;
    //     Approval(msg.sender, _spender, _value);
    //     return true;
    // }

    function transfer(address _to, uint256 _value) public returns (bool){
        return super.transfer(_to, _value);
    }
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool){
        return super.transferFrom(_from, _to, _value);
    }
    function approve(address _spender, uint256 _value) public returns (bool){
        return super.approve(_spender, _value);
    }
    function allowance(address _owner, address _spender) public view returns (uint256){
        return super.allowance(_owner, _spender);
    }
    function totalSupply() public view returns (uint256){
        return super.totalSupply();
    }
    function balanceOf(address _owner) public view returns (uint256){
        return super.balanceOf(_owner);
    }
    function symbol() public view returns (string){
        return super.symbol();
    }
    function name() public view returns (string){
        return super.name();
    }
    function decimals() public view returns (uint8){
        return super.decimals();
    }
    



    function _mint(address _account, uint256 _amount) public 
    {
        require(_account!=address(0));
        require(_totalTokens + _amount <= totalSupply,"Mutahhir: mint limt reached");
        _totalTokens += _amount;
        balance[_account] += _amount;
        // emit Transfer(address(0), _account, _amount);
    } 
    //burn function 
    function _burn(address _account, uint256 _amount) public 
    {
        require(_account!=address(0));
        require(balance[_account] >= _amount);
        _totalTokens -= _amount;
        balance[_account] -= _amount;
        // emit Transfer(address(0), _account, _amount);
    }



}