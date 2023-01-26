# NFT Marketplace

This repository contains my notes and code for the Moralis Academy course "Build an NFT Marketplace".

https://academy.moralis.io/courses/ethereum-dapp-programming

Everything was built and tested under Ubuntu 22.04.


## How to run the project?


Pre-requisites: the project runs within truffle suite. You must have truffle and ganache installed.


- truffle will be used for running contract migration and unit tests
- ganache will run the local blockchain that metamask will connect to

### Deploy the contract to ganache

truffle-config.js defines a `development` network that points to ganache

1. Start ganache

ganache initates a local blockchain an creates 10 test accounts. 

```
$ ganache
ganache v7.5.0 (@ganache/cli: 0.6.0, @ganache/core: 0.6.0)
Starting RPC server

Available Accounts
==================
(0) 0x049fDd7Ea8cd1eb8cCE8d9913Fc1a85ecA09aB32 (1000 ETH)
(1) 0x5a22e412d4c3D6528ECC73920b988CDE5d7D7089 (1000 ETH)
(2) 0xa2ab1CC8816A328C501E899A5ADeD5f625Fc1568 (1000 ETH)
(3) 0x6b2A3dF4BA9e3e1c74b48501996AB49353d44a2b (1000 ETH)
(4) 0x3C0717b887b76a66887D00B354871D51a03c63AB (1000 ETH)
(5) 0xCe77E6CCf7c0AC8f73E0D4E163960CA1Acf934c0 (1000 ETH)
(6) 0x38b1337da91bf540d940A230142c95dE51E47E14 (1000 ETH)
(7) 0x9af4aa0E50eEf456d7108e9381eDA8A2CEA2e195 (1000 ETH)
(8) 0xb2d2a3C30cF5998E4B7B39B448c73b26b1084A9C (1000 ETH)
(9) 0xaFDfB978fCaC757Ef0F798C1B27d5A210e68b075 (1000 ETH)


```

2. Copy the address of the first account and paste it inside truffle-config.js. This is the address that will be used as owner for the contract migration

```
module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
     from: "0x049fDd7Ea8cd1eb8cCE8d9913Fc1a85ecA09aB32", //Address in ganache
    }


```


3. Start truffle console and type 

```
migrate --reset

```

This will use the `development` network by default and deploy Kittycontract to the ganache blockchain from address `0x049fDd7Ea8cd1eb8cCE8d9913Fc1a85ecA09aB32`


```
2_token_migration.js
====================

   Deploying 'Kittycontract'
   -------------------------
   > transaction hash:    0x02fc58d4204fa57a544c5de99f872d9e988f13dd05f125d7e81b0a4ed737ab5a
   > Blocks: 0            Seconds: 0
   > contract address:    0xD7321D5a196CF15e5a85390bDB0aC946092720f5
   > block number:        3
   > block timestamp:     1674728579
   > account:             0x049fDd7Ea8cd1eb8cCE8d9913Fc1a85ecA09aB32
   > balance:             999.990648429328225957
   > gas used:            2634861 (0x28346d)
   > gas price:           3.171811543 gwei
   > value sent:          0 ETH
   > total cost:          0.008357282534000523 ETH

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.008357282534000523 ETH

Summary
=======
> Total deployments:   2
> Final cost:          0.009201552284000523 ETH

```

Make note of the Kittycontract contract address `0xD7321D5a196CF15e5a85390bDB0aC946092720f5`

4. Copy the contract address in the client code in index.js

```
var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
// var contractAddress = "0x1753C9f8bFd56c0A21D9a6552bDC7A5cbE0a3E5b";//Truffle develop
var contractAddress = "0xD7321D5a196CF15e5a85390bDB0aC946092720f5";  //Ganache

```


### Configure Metamask





## How to run unit tests


1. Install truffle-assertions:

> npm install truffle-assertions

2. Run truffle develop
> truffle develop

3. Run the tests
> test
