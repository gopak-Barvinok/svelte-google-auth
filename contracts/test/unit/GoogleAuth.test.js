const { getNamedAccounts, deployments, ethers, network } = require('hardhat')
const { developmentChains, networkConfig } = require('../../helper-hardhat-config')
const {stringToBytes32} = require('../../scripts/toBytes')
const { assert, expect } = require('chai')

!developmentChains.includes(network.name) 
? describe.skip 
: describe("GoogleAuth", () => {
    let googleAuth
    const chainId = network.config.chainId
    const verifier = networkConfig[chainId].verifier
    const login = stringToBytes32("ExampleLogin@gmail.com")
    const statementId = 0

    beforeEach(async() => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        googleAuth = await ethers.getContract("GoogleAuth", deployer)
    })

    describe("constructor", () => {
        it("Should be correct verifier and mintAmount", async () => {
            const getVerifier = await googleAuth.verifier()
            const getMintAmount = await googleAuth.mintAmount()
            assert.equal(getVerifier, verifier)
            assert.equal(getMintAmount, 5)
        })
    })

    describe("registration", () => {
        it("Should be user registering and mint balance", async () => {
            await expect(googleAuth.register(login, statementId))
            .to.emit(googleAuth, "Registration").withArgs(login, deployer, statementId)
            const currentBalance = await googleAuth.getBalance(login)
            assert.equal(currentBalance, 5)
        })

        it("Should be reverted because of user already exists", async () => {
            await googleAuth.register(login, statementId)
            await expect(googleAuth.register(login, statementId))
            .to.be.revertedWith("User already exists")
        })
    })

    describe("setMintAmount", () => {
        it("Should be using only by owner", async () => {
            const [_, destractor] = await ethers.getSigners()
            await expect(googleAuth.connect(destractor).setMintAmount(100)).to.be.reverted
        })
    })
})