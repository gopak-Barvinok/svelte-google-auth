// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IVerifier {
    function verify(
        bytes calldata blob,
        uint256[] calldata init_params,
        int256[][] calldata columns_rotations,
        address gate_argument
    ) external view returns (bool result);
}


contract GoogleAuth is ERC20, Ownable {

    struct User {
        uint64 nonce;
        address verifier;
        uint64 statementId;
        uint160 balance;
    }

    // key is hashed login
    mapping(bytes32 => User) public users;
    mapping(bytes32 => bool) public usedProofs;
    mapping(uint64 => bool) public usedStatements;

    address public verifier;

    uint256 public mintAmount;

    // ERC20 public underlyingToken;

    event Transfer(bytes32 indexed login, address indexed recepient, uint256 amount);
    event Registration(bytes32 indexed login, address sender, uint64 statementId);

    constructor(
        address _verifier
        // address _underlying
    ) 
        ERC20("zkAuth", "zkAUTH")
    {
        verifier = _verifier;
        mintAmount = 5;
        // underlyingToken = ZKAuthToken(_underlying);
    }

    function register(bytes32 login, uint64 statementId) external {
        require(users[login].verifier == address(0), "User already exists");

        // Why this is here?
        // require(!usedStatements[statementId], "Statement already used");
        users[login] = User(0, msg.sender, statementId, uint160(mintAmount));
        usedStatements[statementId] = true;
        _mint(msg.sender, mintAmount);
        emit Registration(login, msg.sender, statementId);
    }

    function setMintAmount(uint256 _mintAmount) public onlyOwner {
        mintAmount = _mintAmount;
    }

    function getBalance(bytes32 login) public view returns(uint160) {
        return users[login].balance;
    }

    function transfer(
        bytes32 login,
        bytes calldata proof,
        uint256[] calldata init_params,
        int256[][] calldata columns_rotations,
        address recepient,
        uint256 amount
    ) external {
        User memory user = users[login];
        require(user.verifier != address(0), "User doesn't exist");

        bytes32 proofHash = keccak256(proof);
        require(!usedProofs[proofHash], "Proof already used");

        require(user.balance >= amount, "Not enough balance");

        bool verifyResult = IVerifier(verifier).verify(proof, init_params, columns_rotations, user.verifier);
        require(verifyResult, "Proof is not valid");

        uint256 contractTokenBalance = balanceOf(address(this));
        require(contractTokenBalance >= amount, "Not enough tokens in the contract");

        transfer(recepient, amount);
        emit Transfer(login, recepient, amount);

        usedProofs[proofHash] = true;
        users[login].nonce++;
    }
}