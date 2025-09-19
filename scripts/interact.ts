// scripts/interact.ts
import "dotenv/config";
import fs from "node:fs/promises";
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  formatUnits,
  http,
  parseUnits,
  getAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Load deployer key from .env (your Account #10)
const PRIVKEY = process.env.PRIVKEY as `0x${string}`;
if (!PRIVKEY) throw new Error("Missing PRIVKEY in .env");

// Hardhat localhost RPC
const RPC_URL = "http://127.0.0.1:8545";

// Helper: detect chain
async function detectChain() {
  const probe = createPublicClient({ transport: http(RPC_URL) });
  const rpcChainId = await probe.getChainId();
  return defineChain({
    id: rpcChainId,
    name: `rpc-${rpcChainId}`,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  });
}

async function main() {
  const chain = await detectChain();

  const account = privateKeyToAccount(PRIVKEY);
  const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });
  const walletClient = createWalletClient({ chain, transport: http(RPC_URL), account });

  // Load ABI + address
  const { abi } = JSON.parse(
    await fs.readFile("artifacts/contracts/CampusCredit.sol/CampusCredit.json", "utf8")
  );
  const { address: tokenAddress } = JSON.parse(
    await fs.readFile(`deployments/${chain.id}-CampusCredit.json`, "utf8")
  );

  console.log("Using token:", tokenAddress);

  // === FIX: Correct Account #1 address ===
  const acct2 = getAddress(
    process.env.ACCT2 || "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
  );

  // Helper: show balances
  const balances = async (label: string) => {
    const b1 = await publicClient.readContract({
      address: tokenAddress,
      abi,
      functionName: "balanceOf",
      args: [account.address],
    });
    const b2 = await publicClient.readContract({
      address: tokenAddress,
      abi,
      functionName: "balanceOf",
      args: [acct2],
    });
    console.log(
      `${label} | Deployer: ${formatUnits(b1 as bigint, 18)} CAMP | Acct2: ${formatUnits(
        b2 as bigint,
        18
      )} CAMP`
    );
  };

  await balances("Before");

  // ---- Tx1: Transfer 100 CAMP
  const tx1 = await walletClient.writeContract({
    address: getAddress(tokenAddress),
    abi,
    functionName: "transfer",
    args: [acct2, parseUnits("100", 18)],
  });
  console.log("Tx1 hash:", tx1);
  await publicClient.waitForTransactionReceipt({ hash: tx1 });

  // ---- Tx2: Transfer 50 CAMP
  const tx2 = await walletClient.writeContract({
    address: getAddress(tokenAddress),
    abi,
    functionName: "transfer",
    args: [acct2, parseUnits("50", 18)],
  });
  console.log("Tx2 hash:", tx2);
  await publicClient.waitForTransactionReceipt({ hash: tx2 });

  // ---- Tx3: Approve acct2 to spend 25 CAMP
  const tx3 = await walletClient.writeContract({
    address: getAddress(tokenAddress),
    abi,
    functionName: "approve",
    args: [acct2, parseUnits("25", 18)],
  });
  console.log("Tx3 hash:", tx3);
  await publicClient.waitForTransactionReceipt({ hash: tx3 });

  await balances("After");

  // Save the 3 hashes for analyze.ts
  await fs.writeFile("tx-last.txt", [tx1, tx2, tx3].join("\n"));
  console.log("Saved all 3 tx hashes to tx-last.txt");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
