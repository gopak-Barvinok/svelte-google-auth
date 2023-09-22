// const { ethers } = require("hardhat")

const networkConfig = {
    11155111: {
        name: "sepolia",
        verifier: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D"
    },
    31337: {
        name: "hardhat",
        verifier: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D"
    }
}

const developmentChains = ["hardhat", "localhost"]


module.exports = {
    networkConfig,
    developmentChains,
}