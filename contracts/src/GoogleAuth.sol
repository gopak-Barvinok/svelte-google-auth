// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract GoogleAuth is ERC20 {

    struct User {
        uint64 nonce;
        address verifier;
        uint64 statementId;
        uint160 balance;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Registration(
        bytes32 indexed login, 
        address indexed verifier, 
        uint64 statementId
    );

    uint256 public mintAmount;

    mapping(bytes32 => User) public users;
    mapping(uint64 => bool) public usedStatements;

    function register(bytes32 login, uint64 statementId) public {
        require(users[login].verifier == address(0), "User already exists");
        require(!usedStatements[statementId], "Statement already used");
        users[login] = User(0, msg.sender, statementId, 150 ether); // hardcoded initial balance
        usedStatements[statementId] = true;
        _mint(msg.sender, mintAmount);
        emit Registration(login, msg.sender, statementId);
    }

    function transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0x0));
        require(balanceOf[_form] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);

        uint256 previousBalance = balanceOf[_from] + balanceOf[_to];
        balanceOf[_from] -= _value && balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    function setMintAmount(uint256 _mintAmount) public onlyOwner {
        mintAmount = _mintAmount;
    }
}