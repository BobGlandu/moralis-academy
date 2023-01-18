const Kitty = artifacts.require('Kittycontract');
const truffleAssert = require('truffle-assertions');


contract("Test breed function", accounts =>{

    let kitty
    let mumId
    let dadId
    let childId

    beforeEach(async()=>{
        kitty = await Kitty.new()

        let mum = await kitty.createKittyGen0(10203040123501)
        truffleAssert.eventEmitted(mum, 'Birth', event=>{
            mumId = event.tokenId
            return true
        })


        let dad = await kitty.createKittyGen0(50708090234602)
        truffleAssert.eventEmitted(dad, 'Birth', event=>{
            dadId = event.tokenId
            return true
        })        


        let child = await kitty.breed(mumId, dadId)
        truffleAssert.eventEmitted(child, 'Birth', event=>{
            childId = event.tokenId
            return true
        })


    })

    afterEach(async()=>{
        kitty = 0
        mumId = 0
        dadId = 0
        childId = 0
    })

    it("caller should own a new cat with higher generation", async()=>{

        var childOwner = await kitty.ownerOf(childId)
        assert(childOwner == accounts[0], "Account 0 should own the new cat")

        var childKitty = await kitty.getKitty(childId)

        assert(childKitty.generation == 1, "Wrong generation")
        assert(childKitty.mumId == mumId.toNumber(), "wrong mum")
        assert(childKitty.dadId == dadId.toNumber(), "wrong dad")
    })


    it("new cat genes should be properly mixed", async()=>{

        var childKitty = await kitty.getKitty(childId)

        assert(childKitty.genes == 10203040234602, "Wrong mixed genes")        
    })


    it("should fail if caller does not own any of the cats", async()=>{
        
        // Does not own any
        await truffleAssert.reverts(
            kitty.breed(mumId, dadId, {from: accounts[1]})
        )

        
    })

    it("should fail if caller owns 1 cat out of 2", async()=>{
        await kitty.transfer(accounts[1], mumId)

        // Owns one
        await truffleAssert.reverts(
            kitty.breed(mumId, dadId, {from: accounts[1]})
        )
    })

    it("should pass if caller owns both cats", async()=>{
        await kitty.transfer(accounts[1], mumId)
        await kitty.transfer(accounts[1], dadId)

        // Owns one
        await truffleAssert.passes(
            kitty.breed(mumId, dadId, {from: accounts[1]})
        )

    })

    
}
)




