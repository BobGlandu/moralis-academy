const Kitty = artifacts.require('Kittycontract');
const truffleAssert = require('truffle-assertions');

const NotERC721 = artifacts.require('Migrations');


contract("Test safeTansferFrom function", accounts =>{

    it("should throw if _to is a contract that does not support ERC721", async()=>{
        let kitty = await Kitty.deployed()

        await kitty.createKittyGen0(123)
        let tokenid = await kitty.totalSupply()-1

        let notERC721 = await NotERC721.deployed()

        await truffleAssert.reverts(
            kitty.safeTransferFrom(accounts[0], notERC721.address, tokenid)
        )


        await truffleAssert.reverts(
            kitty.safeTransferFrom(accounts[0], notERC721.address, tokenid, 0)
        )

    })

    it("should pass if _to is an EOA ", async()=>{
        let kitty = await Kitty.deployed()

        await kitty.createKittyGen0(123)
        let tokenid = await kitty.totalSupply()-1

        await truffleAssert.passes(
            kitty.safeTransferFrom(accounts[0], accounts[1], tokenid, 0)
        )

        await truffleAssert.passes(
            kitty.safeTransferFrom(accounts[1], accounts[2], tokenid, {from: accounts[1]})
        )

    })

    it("should pass if _to is a contract that supports ERC721 ", async()=>{
        let kitty = await Kitty.deployed()

        await kitty.createKittyGen0(123)
        let tokenid = await kitty.totalSupply()-1


        await truffleAssert.passes(
            kitty.safeTransferFrom(accounts[0], kitty.address, tokenid)
        )

        await kitty.createKittyGen0(123)
        tokenid = await kitty.totalSupply()-1

        await truffleAssert.passes(
            kitty.safeTransferFrom(accounts[0], kitty.address, tokenid, 0)
        )


    })



})

