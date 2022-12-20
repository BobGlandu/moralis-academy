// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC721.sol";
import "./Ownable.sol";

contract Kittycontract is IERC721, Ownable {
    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
    }

    event Birth(
        address owner,
        uint256 tokenId,
        uint32 dadId,
        uint32 mumId,
        uint256 genes
    );

    Kitty[] kitties;

    //Associates an EOA with its balance
    mapping(address => uint256) private balances;

    //Associates a token id with its owner
    mapping(uint256 => address) private tokenowners;

    function balanceOf(address owner) external view returns (uint256 balance) {
        return balances[owner];
    }

    function totalSupply() external view returns (uint256 total) {
        return kitties.length;
    }

    function name() external view returns (string memory tokenName) {
        return "ScaredKitty";
    }

    function symbol() external view returns (string memory tokenSymbol) {
        return "SCARKIT";
    }

    // Reverts if a token id does not exists?
    function ownerOf(uint256 tokenid) external view returns (address owner) {
        owner = tokenowners[tokenid];

        require(owner != address(0), "Token id does not exist");
    }

    function transfer(address to, uint256 tokenId) external {
        require(to != address(0), "invalid to address");
        require(to != address(this), "to cannot be the contract address");

        address owner = tokenowners[tokenId];

        require(owner != address(0), "Token id does not exist");
        require(msg.sender == owner, "only owner can make a transfer");

        _transfer(owner, to, tokenId);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        if (_from != address(0)) {
            assert(balances[_from] > 0);

            balances[_from]--;
        }

        tokenowners[_tokenId] = _to;
        balances[_to]++;

        emit Transfer(_from, _to, _tokenId);
    }

    function createKittyGen0(uint256 _genes) public onlyOwner {
        _createKitty(0, 0, 0, _genes, msg.sender);
    }

    function getKitty(uint256 _id)
        public
        view
        returns (
            uint256 genes,
            uint256 birthTime,
            uint32 mumId,
            uint32 dadId,
            uint16 generation
        )
    {
        require(_id < kitties.length, "Invalid cat id");

        Kitty storage kitty = kitties[_id];

        genes = kitty.genes;
        birthTime = kitty.birthTime;
        mumId = kitty.mumId;
        dadId = kitty.dadId;
        generation = kitty.generation;
    }

    function _createKitty(
        uint32 _mumId,
        uint32 _dadId,
        uint16 _generation,
        uint256 _genes,
        address _owner
    ) internal returns (uint256) {
        Kitty memory _kitty = Kitty({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            mumId: _mumId,
            dadId: _dadId,
            generation: _generation
        });

        kitties.push(_kitty);
        uint256 newKittyTokenId = kitties.length - 1;

        _transfer(address(0), _owner, newKittyTokenId);

        emit Birth(_owner, newKittyTokenId, _dadId, _mumId, _genes);
    }
}
