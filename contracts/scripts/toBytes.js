const { ethers } = require("ethers");

function stringToBytes32(str) {
    const maxLength = 32
    const utf8Bytes = ethers.toUtf8Bytes(str)

    const bytes32 = new Uint8Array(maxLength);
    bytes32.set(utf8Bytes, 0);

    const result = ethers.hexlify(bytes32);
    return result;
}

module.exports = {
    stringToBytes32
}