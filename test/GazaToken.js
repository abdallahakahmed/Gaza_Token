var GazaToken = artifacts.require("./GazaToken.sol");

contract("GazaToken", function(accounts){

    it('sets the total supply upon development.', function(){
        return GazaToken.deployed().then(function(instance){
            return instance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000')
        });
    });

})