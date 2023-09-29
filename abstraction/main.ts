import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { Presets, Client } from 'userop';

dotenv.config();
const signingKey = process.env.PRIVATE_SIGNING_KEY || "";
const urlRpc = process.env.RPC_SEPOLIA_URL || "";


async function registerUser(login: string, statementId: number) {

    const contract = "0xfC3aad02Faa9De0B78D0Ee3D17D2346C95C8E121"
    const bytesLogin = ethers.utils.formatBytes32String(login);
    const provider = new ethers.providers.JsonRpcProvider(urlRpc);
    const GOOGLE_AUTH_ABI = require('./googleAuthAbi.json');
    const googleAuth = new ethers.Contract(contract, GOOGLE_AUTH_ABI, provider);

    const registration = {
        to: contract,
        value: ethers.constants.Zero,
        data: googleAuth.interface.encodeFunctionData("register", [bytesLogin, statementId])
    }

    return [registration];
}

async function main() {
    const signer = new ethers.Wallet(signingKey);
    const builder = await Presets.Builder.Kernel.init(signer, urlRpc);
    const address = builder.getSender();
    console.log(`Account address: ${address}`);

    const login = "examplelogin@gmail.com";
    const statementId = 12;
    const calls = await registerUser(login, statementId);
    builder.executeBatch(calls);
    console.log(builder.getOp());

    const client = await Client.init(urlRpc);
    const res = await client.sendUserOperation(builder, {
        onBuild: (op) => console.log("Signed userOperation:", op)
    });

    // console.log(`UserOperationHash: ${res.userOpHash}`);
    // console.log("Waiting for transaction...");
    // const ev = await res.wait();
    // console.log(`Transaction hash: ${ev?.transactionHash ?? null}`)
}

export default main()