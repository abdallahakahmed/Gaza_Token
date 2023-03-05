var GazaToken = artifacts.require("./GazaToken.sol");

module.exports = function(deployer) {
    deployer.deploy(GazaToken, 1000000); // the deploy function pass multiple arguments
}

