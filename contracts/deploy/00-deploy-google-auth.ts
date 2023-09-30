import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { verify } from '../utils/verify';
import { developmentChains, networkConfig } from '../helper-hardhat-config';
import { ethers } from 'hardhat'

export default async function deployGoogleAuth({
  deployments,
  getNamedAccounts,
  network,
}: HardhatRuntimeEnvironment): Promise<void> {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  // const chainId = network.config.chainId!
  const verifier = "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D";


  const args = [verifier];

  log('-------------------------------------------------------');
  log('Deploying GoogleAuth and waiting for confirmations');
  const googleAuth = await deploy('GoogleAuth', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 1,
  });
  log(`GoogleAuth deployed at ${googleAuth.address}`);

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log('Verifying...');
    await verify(googleAuth.address, args);
  }
  log('-------------------------------------------------------');
}

deployGoogleAuth.tags = ['all', 'googleAuth'];
