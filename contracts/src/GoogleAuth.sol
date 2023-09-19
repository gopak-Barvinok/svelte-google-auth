// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

contract GoogleAuth {

    struct User {
        uint64 nonce;
        address verifier;
        uint64 statementId;
        uint160 balance;
    }

    event Registration(
        bytes32 indexed login, 
        address indexed verifier, 
        uint64 statementId
    );

    mapping(bytes32 => User) public users;
    mapping(uint64 => bool) public usedStatements;

    function register(bytes32 login, uint64 statementId) public {
        require(users[login].verifier == address(0), "User already exists");
        require(!usedStatements[statementId], "Statement already used");
        users[login] = User(0, msg.sender, statementId, 150 ether); // hardcoded initial balance
        usedStatements[statementId] = true;
        emit Registration(login, msg.sender, statementId);
    }
}