const Kitty = artifacts.require('Kittycontract');
const truffleAssert = require('truffle-assertions');


contract("Test transferFrom function", accounts =>{
    it("should throw if msg.sender is not owner, operator or token approver", async()=>{
        let kitty = await Kitty.deployed()

        await kitty.createKittyGen0(123)
        
        let owner = await kitty.ownerOf(0)
        assert(owner != accounts[1], "Pre-requisite: msg.sender is not the owner")
        
        let operator = await kitty.isApprovedForAll(owner, accounts[1])
        assert(operator == false, "Pre-requisite: msg.sender is not operator")

        let approver = await kitty.getApproved(0)
        assert(approver != accounts[1], "Pre-requisite: msg.sender is not approver")

        await truffleAssert.reverts(
            kitty.transferFrom(accounts[0], accounts[2], 0, {from: accounts[1]})
        )
    })


    it("should pass if msg.sender is owner", async()=>{
        let kitty = await Kitty.deployed()

        await kitty.createKittyGen0(123)
        let tokenid = await kitty.totalSupply()-1

        await truffleAssert.passes(
            kitty.transferFrom(accounts[0], accounts[1], tokenid, {from: accounts[0]}),
            "should pass if msg.sender is the owner"
        )

        let newOwner = await kitty.ownerOf(tokenid)
        assert(newOwner == accounts[1], "Ownership should have been transferred to account1")

    })

    it("should pass if msg.sender is operator ", async()=>{
        let kitty = await Kitty.deployed()

        await kitty.createKittyGen0(123)
        let tokenid = await kitty.totalSupply()-1

        await kitty.setApprovalForAll(accounts[1], true)

        await truffleAssert.passes(
            kitty.transferFrom(accounts[0], accounts[2], tokenid, {from: accounts[1]})
        )

        let newOwner = await kitty.ownerOf(tokenid)
        assert(newOwner == accounts[2], "Ownership should have been transferred to account2")

    })

    it("should pass if msg.sender in an approver of a token id", async()=>{
        let kitty = await Kitty.deployed();

        await kitty.createKittyGen0(123)
        let tokenId = await kitty.totalSupply()-1;

        await kitty.approve(accounts[3], tokenId)
        let approver = await kitty.getApproved(tokenId)
        assert(approver == accounts[3], "Pre-requisite: account3 should be approver of token id "  + tokenId)

        let isOperator = await kitty.isApprovedForAll(accounts[0], accounts[3])
        assert(isOperator == false, "Pre-requisite: Account3 is not operator of account0")

        // EOA3 is approver of token id and should be able to transfer it to someone else 
        await truffleAssert.passes(
            kitty.transferFrom(accounts[0], accounts[4], tokenId, {from: accounts[3]})
        )

        let newOwner = await kitty.ownerOf(tokenId)
        assert(newOwner == accounts[4], "Ownership should have been transferred to account4")

    })

    it("should throw if _from is not the current owner", async()=>{
        let kitty = await Kitty.deployed();

        await kitty.createKittyGen0(123)
        let tokenId = await kitty.totalSupply()-1;

        await truffleAssert.reverts(
            kitty.transferFrom(accounts[1], accounts[4], tokenId, {from: accounts[0]})
        )

    })    

    it("should fail if _to is the 0 address", async()=>{
        let kitty = await Kitty.deployed();

        await kitty.createKittyGen0(123)
        let tokenId = await kitty.totalSupply()-1;

        await truffleAssert.fails(
            // the ABI raises an error
            kitty.transferFrom(accounts[0], 0, tokenId, {from: accounts[0]})
        )
    })

})



