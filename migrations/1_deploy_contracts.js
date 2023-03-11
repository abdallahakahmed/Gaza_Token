var GazaToken = artifacts.require("./GazaToken.sol");
var GazaTokenSale = artifacts.require("./GazaTokenSale.sol");

module.exports = function(deployer) {
    deployer.deploy(GazaToken, 1000000).then(function(){
        // token price is 0.001 Ether
        var tokenPrice = 1000000000000000;
        return deployer.deploy(GazaTokenSale, GazaToken.address, tokenPrice);
    }); 
    
}

