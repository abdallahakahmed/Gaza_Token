// const TruffleContract = require('truffle-contract');
// const Web3 = require('web3');

App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,

    init: function () {
        console.log("App initialized...")
        return App.initWeb3();
    },

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = window.ethereum;
            web3 = new Web3(window.ethereum);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();
    },

    initContracts: function () {
        $.getJSON("GazaTokenSale.json", function (dappTokenSale) {
            App.contracts.GazaTokenSale = TruffleContract(dappTokenSale);
            App.contracts.GazaTokenSale.setProvider(App.web3Provider);
            App.contracts.GazaTokenSale.deployed().then(function (dappTokenSale) {
                console.log("Gaza Token Sale Address:", dappTokenSale.address);
            });
        }).done(function () {
            $.getJSON("GazaToken.json", function (dappToken) {
                App.contracts.GazaToken = TruffleContract(dappToken);
                App.contracts.GazaToken.setProvider(App.web3Provider);
                App.contracts.GazaToken.deployed().then(function (dappToken) {
                    console.log("Gaza Token Address:", dappToken.address);
                });

                App.listenForEvents();
                return App.render();
            });
        })
    },

    // Listen for events emitted from the contract
    listenForEvents: function () {
        App.contracts.GazaTokenSale.deployed().then(function (instance) {
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: 'latest',
            }).watch(function (error, event) {
                console.log("event triggered", event);
                App.render();
            })
        })
    },

    render: function () {
        if (App.loading) {
            return;
        }
        App.loading = true;

        var loader = $('#loader');
        var content = $('#content');

        loader.show();
        content.hide();

        // Load account data
        web3.eth.getCoinbase(function (err, account) {
            if (err === null) {
                App.account = account;
                $('#accountAddress').html("Your Account: " + account);
            }
        })

        // Load token sale contract
        App.contracts.GazaTokenSale.deployed().then(function (instance) {
            dappTokenSaleInstance = instance;
            return dappTokenSaleInstance.tokenPrice();
        }).then(function (tokenPrice) {
            App.tokenPrice = tokenPrice;
            $('.token-price').html(Number(web3.fromWei(App.tokenPrice, "ether")));
            return dappTokenSaleInstance.tokensSold();
        }).then(function (tokensSold) {
            App.tokensSold = Number(tokensSold);
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);

            var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
            $('#progress').css('width', progressPercent + '%');

            // Load token contract
            App.contracts.GazaToken.deployed().then(function (instance) {
                dappTokenInstance = instance;
                return dappTokenInstance.balanceOf(App.account);
            }).then(function (balance) {
                $('.gaza-balance').html(Number(balance));
                App.loading = false;
                loader.hide();
                content.show();
            })
        });
    },

    buyTokens: function () {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.GazaTokenSale.deployed().then(function (instance) {
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 500000 // Gas limit
            });
        }).then(function (result) {
            console.log("Tokens bought...")
            $('form').trigger('reset') // reset number of tokens in form
            // Wait for Sell event
        });
    }
}

$(function () {
    $(window).load(function () {
        App.init();
    })
});