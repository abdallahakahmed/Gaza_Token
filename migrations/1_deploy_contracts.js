var GazaToken = artifacts.require("./GazaToken.sol");

module.exports = function(deployer) {
    deployer.deploy(GazaToken);
}

