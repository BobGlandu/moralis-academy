const Kitty = artifacts.require("Kittycontract");
const truffleAssert = require("truffle-assertions");


contract("Test approve function", accounts =>{

    // State is not reset in-between this sequence of tests therefore fix them in sequence and add new tests at the end

    it("only an owner of a token id should be able to nominate approver", async()=>{

        let kitty = await Kitty.deployed();

        await kitty.createKittyGen0(123);
        let tokenId = await kitty.totalSupply()-1;

        assert(kitty.getApproved(tokenId) != accounts[1], accounts[1] + " should not be an approver");

        await truffleAssert.reverts(
            kitty.approve(accounts[1], tokenId, {from: accounts[2]})    
        )

        await truffleAssert.passes(
            kitty.approve(accounts[1], tokenId)    
        )

        let approver = await kitty.getApproved(tokenId);

        assert(approver == accounts[1], "getApproved failed");

    })


    it("an approver of the current token should not be able to call approve", async()=>{
        let kitty = await Kitty.deployed()

        await kitty.createKittyGen0(123);
        let tokenId = await kitty.totalSupply()-1

        await kitty.approve(accounts[3], tokenId, {from: accounts[0]})
        let approver = await kitty.getApproved(tokenId)
        assert(approver == accounts[3], "Pre-requisite: Account 3 should be approver of token " + tokenId)

        let isOperator = await kitty.isApprovedForAll(accounts[0], accounts[3])     
        assert(isOperator == false, "account 3 should not be operator of the token owner")   

        await truffleAssert.reverts(
            kitty.approve(accounts[4], tokenId, {from: accounts[3]})
        )

    })


    it("The approver of a token should be removed when the token is transferred", async()=>{
        let kitty = await Kitty.deployed()

        await kitty.createKittyGen0(123);
        let tokenId = await kitty.totalSupply()-1

        await kitty.approve(accounts[3], tokenId)
        let tokenOperator = await kitty.getApproved(tokenId)
        assert(tokenOperator == accounts[3], "Account 3 should be approved for token id " + tokenId)

        // EOA 0 transfers the token to EOA 4. EOA 3 should not be approved for token any more
        await kitty.transfer(accounts[4], tokenId)

        tokenOperator = await kitty.getApproved(tokenId)
        assert(tokenOperator == 0, tokenOperator + " should not be approved for token 0 any more")
    })
})


contract("Test setApproveForAll function", accounts =>{
    it("isApprovedForAll should reflect changes made with setApprovedForAll", async()=>{
        let kitty = await Kitty.deployed();     
        
        let approved = await kitty.isApprovedForAll(accounts[0], accounts[1]);
        assert(approved == false, "account 1 should not be an approver of account 0")

        // account 0 sets account 1 as one of the approvers
        await kitty.setApprovalForAll(accounts[1], true, {from: accounts[0]});

        approved = await kitty.isApprovedForAll(accounts[0], accounts[1]);
        assert(approved == true, "account 1 should be an approver of account 0");
    })

    it("A named approver should be able to transfer an owner's asset", async()=>{
        let kitty = await Kitty.deployed();

        // EOA 0 owns token id 0
        await kitty.createKittyGen0(123, {from: accounts[0]})

        // EOA 2 is approver of EOA 0
        await kitty.setApprovalForAll(accounts[2], true, {from: accounts[0]})

        let approved = await kitty.isApprovedForAll(accounts[0], accounts[2])
        assert(approved == true, "Account 2 should be approver of account 0")


        // EOA 2 should be able to transfer token id 0 to another address
        await truffleAssert.passes(
            kitty.transfer(accounts[3], 0, {from: accounts[2]})
        )

        let owner = await kitty.ownerOf(0)
        assert(owner == accounts[3], "Account 3 should be the new owner")

    })

    it("an authorized operator of the current owner should be able to call approve on an owner's token", async()=>{
        let kitty = await Kitty.deployed()

        let tokenId = await kitty.totalSupply()-1
        let owner = await kitty.ownerOf(tokenId)        
        assert(owner == accounts[3], "Pre-requisite: Account 3 should be owner of token " + tokenId)

        await kitty.setApprovalForAll(accounts[4], true, {from: accounts[3]})
        let approved = await kitty.isApprovedForAll(accounts[3], accounts[4])
        assert(approved == true, "Pre-requisite: Account 4 should be operator of Account 3")

        // Account 4 should be able to approve Account 5
        await truffleAssert.passes(
            kitty.approve(accounts[5], tokenId, {from: accounts[4]})
        )

        let approver = await kitty.getApproved(tokenId)
        assert(approver == accounts[5], "Account 5 should be approver of token " + tokenId)

    })

//     it("should emit ApprovalForAll event", async()=>{
//         let kitty = await Kitty.deployed();

//         // EOA 0 owns token id 0
//         await kitty.createKittyGen0(123)

//         await kitty.setApprovalForAll(accounts[1], true, {from: accounts[0]})



//         // EOA 1 is approver of EOA 0
//         await truffleAssert.eventEmitted(
//             kitty.setApprovalForAll(accounts[1], true, {from: accounts[0]})
//         )

//    })


})

