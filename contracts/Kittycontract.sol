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

    //Approvers of a token id
    mapping(uint256 => address) private tokenApprovers;
    mapping(address => mapping(address => bool)) private ownerApprovers;

    function balanceOf(address owner) external view returns (uint256 balance) {
        return balances[owner];
    }

    function totalSupply() external view returns (uint256 total) {
        return kitties.length;
    }

    function name() external pure returns (string memory tokenName) {
        return "ScaredKitty";
    }

    function symbol() external pure returns (string memory tokenSymbol) {
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
        require(tokenId < kitties.length, "Invalid token id");

        address owner = tokenowners[tokenId];

        require(owner != address(0), "Token id does not exist");
        require(msg.sender == owner || tokenApprovers[tokenId] == msg.sender || ownerApprovers[owner][msg.sender] == true, "only owner/approver can make a transfer");

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
        // Account approved on this token should be revoked
        delete tokenApprovers[_tokenId];

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

        return newKittyTokenId;
    }

    function approve(address _approved, uint256 _tokenId) external{

        require(_tokenId < kitties.length, "Token id does not exist");

        //msg.sender must be the owner or an existing operator of tokenId
        address tokenOwner = tokenowners[_tokenId];

        require( (tokenOwner == msg.sender || ownerApprovers[tokenOwner][msg.sender] == true) , 'Caller is not owner of the token or an approver of the token owner'); 

        _approve(_approved, _tokenId);        

    }

    /// @notice Change or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    ///  Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner.
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    function _approve(address _approved, uint256 _tokenId) private{

        tokenApprovers[_tokenId] = _approved;     
    }

    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param _operator Address to add to the set of authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external{
        
        ownerApprovers[msg.sender][_operator] = _approved;

        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT.
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _tokenId) external view returns (address){
        require(_tokenId < kitties.length, "Invalid token id");

        return tokenApprovers[_tokenId];

    }

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) external view returns (bool){
        return ownerApprovers[_owner][_operator];
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata data) external{

        _transferFrom(_from, _to, _tokenId);

        //TBD
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev This works identically to the other function with an extra data parameter,
    ///  except this function just sets data to "".
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external{
    }


    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function transferFrom(address _from, address _to, uint256 _tokenId) external{
        _transferFrom(_from, _to, _tokenId);
    }    

    function _transferFrom(address _from, address _to, uint256 _tokenId) private{
        //msg.sender must be the owner or an existing operator of tokenId
        require(_to != address(0), "invalid _to address");
        require(_tokenId < kitties.length, "Invalid token id");

        address tokenOwner = tokenowners[_tokenId];
        require(_from == tokenOwner, "_from should be the token owner");

        address approver = tokenApprovers[_tokenId];    
        require( (tokenOwner == msg.sender 
        || ownerApprovers[tokenOwner][msg.sender] == true
        || approver == msg.sender) , 'Caller is not owner of the token or an operator of the token owner or an approver of the token'); 

        _transfer(_from, _to, _tokenId);

    }

}
