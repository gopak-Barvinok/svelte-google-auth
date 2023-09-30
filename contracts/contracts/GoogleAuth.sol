// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IVerifier {
    function verify(
        bytes calldata blob,
        uint256[] calldata init_params,
        int256[][] calldata columns_rotations,
        address gate_argument
    ) external view returns (bool result);
}


contract GoogleAuth is ERC20, Ownable {

    using SafeMath for uint256;

    struct User {
        uint64 nonce;
        address verifier;
        uint64 statementId;
        uint256 balance;
    }

    // key is hashed login
    mapping(bytes32 => User) public users;
    mapping(bytes32 => bool) public userIsPresent;
    mapping(bytes32 => bool) public usedProofs;
    mapping(uint64 => bool) public usedStatements;

    address public verifier;

    uint256 public mintAmount;

    // ERC20 public underlyingToken;

    event Transfer(bytes32 indexed login, address indexed recepient, uint256 amount);
    event Registration(bytes32 indexed login, address verifier, uint64 statementId);

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

    function register(string memory loginStr, uint64 statementId) external {
        bytes32 login = bytes32(bytes(loginStr));
        require(users[login].verifier == address(0), "User already exists");
        // Why this is here?
        require(!usedStatements[statementId], "Statement already used");
        usedStatements[statementId] = true;
        _mint(address(this), mintAmount);
        users[login] = User(0, msg.sender, statementId, uint160(mintAmount));
        userIsPresent[login] = true;
        emit Registration(login, msg.sender, statementId);
    }

    function setMintAmount(uint256 _mintAmount) public onlyOwner {
        mintAmount = _mintAmount;
    }

    function checkUser(string memory loginStr) public view returns(bool) {
        bytes32 login = bytes32(bytes(loginStr));
        return userIsPresent[login];
    }

    function getBalance(string memory loginStr) public view returns(uint256) {
        bytes32 login = bytes32(bytes(loginStr));
        require(userIsPresent[login], "User is absent");
        return users[login].balance;
    }

    function transferZk(
        string memory loginStr,
        bytes calldata proof,
        uint256[] calldata init_params,
        int256[][] calldata columns_rotations,
        address recepient,
        uint256 amount
    ) external {
        bytes32 login = bytes32(bytes(loginStr));
        User memory user = users[login];
        require(user.verifier != address(0), "User doesn't exist");

        bytes32 proofHash = keccak256(proof);
        require(!usedProofs[proofHash], "Proof already used");

        require(user.balance >= amount, "Not enough balance");


        bool verifyResult = IVerifier(user.verifier).verify(proof, init_params, columns_rotations, user.verifier);
        require(verifyResult, "Proof is not valid");

        uint256 contractTokenBalance = balanceOf(address(this));
        require(contractTokenBalance >= amount, "Not enough tokens in the contract");

        transfer(recepient, amount);

        emit Transfer(login, recepient, amount);
        user.balance.sub(amount);
        usedProofs[proofHash] = true;
        user.nonce++;
    }
}