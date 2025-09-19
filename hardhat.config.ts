import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-viem";
import * as dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545"; // fallback to local
const CHAIN_ID = Number(process.env.CHAIN_ID || 31346);
const PRIVKEY  = process.env.PRIVKEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    // In-process Hardhat local node
    hardhat: {
      type: "edr-simulated",
      chainType: "l1",
      chainId: 31337,
      initialBaseFeePerGas: 1_000_000_000, // 1 gwei
    },
    // Connect to external localhost (npx hardhat node)
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: [], // uses node accounts automatically
    },
    // DIDLab remote RPC (when server is up)
    didlab: {
      type: "http",
      chainType: "l1",
      url: RPC_URL,
      chainId: CHAIN_ID,
      accounts: PRIVKEY ? [PRIVKEY] : [],
    },
  },
};

export default config;
