export interface NetworkConfig {
    [key: number]: {
      name: string;
    //   verifier: string;
    };
}

export const networkConfig: NetworkConfig = {
    11155111: {
        name: "sepolia",
        // verifier: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D"
    },
    31337: {
        name: "hardhat"
    }
}

export const developmentChains = ["hardhat", "localhost"]

