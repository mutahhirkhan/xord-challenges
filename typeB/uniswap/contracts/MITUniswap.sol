// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;
import "./interface.sol";
// import "hardhat/console.sol";
contract MITUniswap {
    uint lineancy = 6*60*60;
    // UniswapV2Router02 uniswap;

    address  uniswaprouteraddress = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address uniswapFactory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    IUniswap uniswap = IUniswap(uniswaprouteraddress);

    modifier ensure(uint _leniency) {
        require(block.timestamp + _leniency >= block.timestamp, "MITUniswap: EXPIRED");
        _;
    }

    constructor(address _uniswap) { uniswap = IUniswap(_uniswap); }

    function swapExTokForTok( 
        address _tokenAddress1,
        address _tokenAddress2,
        uint _amountIn,
        uint _amountOutMin) 
        external ensure(lineancy) returns (uint[] memory amounts)  {
            IERC20(_tokenAddress1).transferFrom(msg.sender, address(this), _amountIn);
            address [] memory path  = new address [](2);
            path[0] = _tokenAddress1;
            path[1] = _tokenAddress2;
            IERC20(_tokenAddress1).approve(address(uniswaprouteraddress), _amountIn);
            //6 hours lineancy for tx execution
            uint[] memory amountOfDifferentTokens = uniswap.swapExactTokensForTokens(_amountIn, _amountOutMin, path, msg.sender, block.timestamp + lineancy);    
            return amountOfDifferentTokens;
            
    }
    
    function swapTokForExToks(
        address _tokenAddress1,
        address _tokenAddress2,
        uint _amountInMax,
        uint _amountOut) external ensure(lineancy) returns (uint[] memory amounts) {
            IERC20(_tokenAddress1).transferFrom(msg.sender, address(this), _amountInMax);
            address [] memory path  = new address [](2);
            path[0] = _tokenAddress1;
            path[1] = _tokenAddress2;
            IERC20(_tokenAddress1).approve(address(uniswaprouteraddress), _amountInMax);
            uint[] memory amountOfDifferentTokens = uniswap.swapTokensForExactTokens(_amountInMax, _amountOut, path, msg.sender, block.timestamp + lineancy);    
            return amountOfDifferentTokens;
    }

    function swapExEthForTok(uint _amountOutMin, address _tokenAddress) external returns(uint [] memory){
            address [] memory path  = new address [](2);
            path[0] = uniswap.WETH();
            path[1] = _tokenAddress;
            uint[] memory amountOfDifferentTokens = uniswap.swapExactETHForTokens(_amountOutMin, path, msg.sender, block.timestamp + lineancy);
            return amountOfDifferentTokens;
    }

    function swapTokForExEth(uint _amountOut, uint _amountInMax, address _tokenAddress) 
            external ensure(lineancy) 
            returns (uint[] memory amounts) 
            {
            IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amountInMax);
            address [] memory path  = new address [](2);
            path[0] = _tokenAddress;
            path[1] = uniswap.WETH();
            IERC20(_tokenAddress).approve(address(uniswaprouteraddress), _amountInMax);
            uint[] memory amountOfDifferentTokens = uniswap.swapTokensForExactETH(_amountOut, _amountInMax, path,  msg.sender, block.timestamp + lineancy);
            return amountOfDifferentTokens;

    }
}   