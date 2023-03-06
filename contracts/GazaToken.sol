// SPDX-License-Identifier: GPL-3.0 
pragma solidity >= 0.7.0 <= 0.9.0;

contract GazaToken {

    string public name = "Gaza Token";
    string public symbol = "GAZT";
    string public standard = "Gaza Token v1.0";
    uint public totalSupply;

    event Transfer(address indexed _from, address indexed _to, uint _value);

    event Approval(address indexed _owner, address indexed _spender, uint _value);

    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

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

    function approve(address _spender, uint _value) public returns (bool success) {

        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint _value) public returns(bool sucess) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        
        return true;
    }

}
