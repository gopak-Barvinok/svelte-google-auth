const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    // const chainId = network.config.chainId;

    const verifier = ""

    const args = [
        verifier
    ]

    const googleAuth = await deploy("GoogleAuth", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log("Verifying...")
        await verify(googleAuth.address, args)
    }
    log("-------------------------------------------------------")
}

module.exports.tags = ["all", "googleAuth"]