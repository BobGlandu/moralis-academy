// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC721.sol";

contract Kittycontract is IERC721{


    //Associates an EOA with its balance
    mapping(address => uint) private balances; 

    //Associates a token id with its owner
    mapping(uint => address) private tokenowners;


    function balanceOf(address owner) external view returns (uint256 balance) {
        return balances[owner];
    }

    function totalSupply() external view returns (uint256 total){
        return 200;
    }

    function name() external view returns (string memory tokenName){
        return "ScaredKitty";
    }

    function symbol() external view returns (string memory tokenSymbol){
        return "SCARKIT";
    }

    // Reverts if a token id does not exists?
    function ownerOf(uint256 tokenid) external view returns (address owner){

        owner = tokenowners[tokenid];

        require(owner != address(0), 'Token id does not exist');

    }

    function transfer(address to, uint256 tokenId) external{

        require(to != address(0), 'invalid to address');
        require(to != address(this), 'to cannot be the contract address');

        address owner = tokenowners[tokenId];

        require(owner != address(0), 'Token id does not exist');
        require(msg.sender == owner, 'only owner can make a transfer');

        tokenowners[tokenId] = to;

        emit Transfer(msg.sender, to, tokenId);

    }
}





