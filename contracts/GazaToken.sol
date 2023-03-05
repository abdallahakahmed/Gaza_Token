// SPDX-License-Identifier: GPL-3.0 
pragma solidity >= 0.7.0 <= 0.9.0;

contract GazaToken {

    string public name = "Gaza Token";
    string public symbol = "GAZT";
    string public standard = "Gaza Token v1.0";
    uint public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint _value);

    mapping(address => uint) public balanceOf;

    constructor(uint _initalSupply) {
        balanceOf[msg.sender] = _initalSupply;
        totalSupply = _initalSupply;
    }

    function transfer(address _to, uint _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

}
