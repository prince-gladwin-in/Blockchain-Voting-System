const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("\n🚀 Starting Blockchain Voting System Deployment...\n");

  // Get the ContractFactory and Signers here.
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy VotingSystem contract
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  console.log("⏳ Deploying VotingSystem contract...");
  
  const votingSystem = await VotingSystem.deploy();
  await votingSystem.waitForDeployment();
  
  const contractAddress = await votingSystem.getAddress();
  console.log("✅ VotingSystem deployed to:", contractAddress);

  // Save contract address and ABI for frontend
  const contractsDir = path.join(__dirname, '../../frontend/src/contracts');
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  const addressData = {
    VotingSystem: contractAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(contractsDir, 'contract-address.json'),
    JSON.stringify(addressData, null, 2)
  );

  // Save contract ABI
  const artifact = await hre.artifacts.readArtifact("VotingSystem");
  fs.writeFileSync(
    path.join(contractsDir, 'VotingSystem.json'),
    JSON.stringify(artifact.abi, null, 2)
  );

  console.log("📦 Contract artifacts saved to frontend/src/contracts/");

  // Verify contract owner
  const owner = await votingSystem.owner();
  console.log("\n🔐 Contract owner:", owner);
  console.log("✓ Owner matches deployer:", owner.toLowerCase() === deployer.address.toLowerCase());

  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Block: ${await hre.ethers.provider.getBlockNumber()}`);
  console.log("=".repeat(60));
  
  console.log("\n✨ Deployment completed successfully!");
  console.log("\n📋 Next Steps:");
  console.log("1. Start the backend server: cd backend && npm run dev");
  console.log("2. Start the frontend: cd frontend && npm start");
  console.log("3. Connect MetaMask to localhost:8545");
  console.log("4. Import a test account from Hardhat node");
  console.log("5. Create an admin account and start voting!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
