import { loadFixture }  from "@nomicfoundation/hardhat-network-helpers";
import { developmentChains, networkConfig } from '../../helper-hardhat-config';
import { expect, assert } from "chai";
import { ethers, network } from 'hardhat';


!developmentChains.includes(network.name) 
? describe.skip 
: describe("GoogleAuth Contract", () => {
    const login = "examplelogin@gmail.com";

    async function deployGoogleAuthFixture() {
        const GoogleAuth = await ethers.getContractFactory("GoogleAuth");
        const [owner, verifier, addr1, addr2] = await ethers.getSigners();
        const googleAuth = await GoogleAuth.deploy(verifier);
        await googleAuth.waitForDeployment();
        return { googleAuth, verifier, owner, addr1, addr2};
    }
    describe("Constructor", () => {
        it("Should be correct mintAmount", async () => {
            const { googleAuth } = await loadFixture(deployGoogleAuthFixture);
            expect(await googleAuth.mintAmount()).to.equal(5);
        })
        it("should be correct verifier", async () => {
            const { googleAuth, verifier } = await loadFixture(deployGoogleAuthFixture);
            expect(await googleAuth.verifier()).to.equal(verifier.address);
        })
    })
    describe("Register", () => {
        it("Should be added user to mapping", async () => {
            const { googleAuth } = await loadFixture(deployGoogleAuthFixture);
            const googleAuthTx = await googleAuth.register(login, 0);
            await googleAuthTx.wait();
            expect(await googleAuth.checkUser(login)).to.be.true;
        })
        it("Should be correct balanceOf contract's tokens", async () => {
            const { googleAuth } = await loadFixture(deployGoogleAuthFixture);
            const googleAuthAddr = await googleAuth.getAddress();
            const googleAuthTx = await googleAuth.register(login, 0);
            await googleAuthTx.wait();
            expect(await googleAuth.balanceOf(googleAuthAddr)).to.equal(5);
        })
        it("Should be correct user's balance in contract", async () => {
            const { googleAuth } = await loadFixture(deployGoogleAuthFixture);
            const googleAuthTx = await googleAuth.register(login, 0);
            await googleAuthTx.wait();
            expect(await googleAuth.getBalance(login)).to.equal(5);
        })
        it("Should to be reverted because of user already exist", async () => {
            const { googleAuth } = await loadFixture(deployGoogleAuthFixture);
            const googleAuthTx = await googleAuth.register(login, 0);
            await googleAuthTx.wait();
            await expect(googleAuth.register(login, 0)).to.be.revertedWith("User already exists")
        })
    })
})