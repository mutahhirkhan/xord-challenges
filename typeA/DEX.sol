// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; //modifier for non-reentrance
import "./ERC721.sol";
import "hardhat/console.sol";

//tokenId => nft id
//itemId => marketItem id

contract DEX is Mutahhir, ReentrancyGuard {
    uint itemId = 0;
    uint itemsSold = 0;

    // itemId => price => MarketItem
    mapping (uint =>  MarketItem) requiredMarketItem;

    struct MarketItem {
        uint256 itemId; //unique identifier for marketplace
        // address nftContract; //contract address for digital asset
        uint256 tokenId; //asset id
        uint256 price; //price on sale
        address payable seller; //person putting item on sale
        address payable owner; //initially empty because yet not sold
    }

    event MarketItemCreated (uint  _itemId, uint indexed _tokenId, uint indexed _price, address indexed _seller, address _buyer);
    event MarketItemSold (uint  _itemId, uint indexed _tokenId, uint  _price, address indexed _seller, address indexed _buyer);

    function createMarketItem(uint _tokenId, uint _price) external {
        require(_price >= 0, "DEX: Price can not be negative");
        // ownerOf
        // getApproved
        // isApprovedForAll
        address owner = ownerOf(_tokenId);
        require(owner == msg.sender || getApproved(_tokenId) == msg.sender || isApprovedForAll(owner, msg.sender), "DEX: not the operator or owner or authorized");
        requiredMarketItem[itemId] = MarketItem(itemId, _tokenId, _price, payable(msg.sender), payable(address(0)));
        itemId++;
        emit MarketItemCreated(itemId, _tokenId, _price ,msg.sender, address(0));


    }
    function createMarketSale(uint _itemId  )public payable{
        require(msg.sender != address(0));
        MarketItem memory _item = requiredMarketItem[_itemId];
        uint256 price = _item.price;
        uint256 tokenId = _item.tokenId;
        address seller = _item.seller;

        require(msg.value == price, "DEX: please send the required amount to process ");
        
        safeTransferFrom(seller, msg.sender, tokenId);
        
        //transfer amount
        _item.seller.transfer(msg.value);

        requiredMarketItem[_itemId].owner = payable(msg.sender); 
        itemsSold++;
        emit MarketItemSold( _itemId, tokenId, price, _item.seller, msg.sender);

    }
    function listAllItems() public view returns (MarketItem [] memory ) {
        uint unsoldItems = itemId - itemsSold;
        MarketItem[] memory allMarketItems = new MarketItem[](unsoldItems); //the length of this array will be unsoldItems
        uint currentIndex = 0;

        for (uint i = 0; i < itemId; i++) {
            //check for unsold items
            if (requiredMarketItem[i + 1].owner == address(0)) {
                uint currentId = requiredMarketItem[i + 1].itemId;
                MarketItem memory currentItem = requiredMarketItem[currentId];
                console.log(currentItem.price);
                allMarketItems[currentIndex] = currentItem;
                currentId++;
            }
        }
        return allMarketItems;
    }

}