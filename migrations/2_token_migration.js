const Kitty = artifacts.require("Kittycontract");

module.exports = function (deployer) {
  deployer.deploy(Kitty);
};
