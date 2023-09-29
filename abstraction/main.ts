import * as dotenv from 'dotenv';
import { ethers } from "ethers";
import { Presets, Client } from "userop";

const paymasterRpcUrl = "https://api.stackup.sh/v1/paymaster/API_KEY";
const paymasterContext = {type: "payg"};
const paymaster = Presets.Middleware.verifyingPaymaster(
    paymasterRpcUrl,
    paymasterContext
);




