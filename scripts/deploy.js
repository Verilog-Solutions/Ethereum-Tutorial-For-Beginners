// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");



async function main() {
  const [owner] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("Token");
  const hardhatToken = await Token.deploy();

  console.log(
    ` hardhat token deployed to ${hardhatToken.address}`
  );
}

async function main() {
  const [owner] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("Token");
  const hardhatToken = await Token.deploy();
  console.log(
    ` hardhat token deployed to ${hardhatToken.address}`
  );

    // verify the contract after deploying
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
      console.log("Waiting for block confirmations...")
      await hardhatToken.deployTransaction.wait(1)
      await verify(hardhatToken.address, [])
    }
}

// async function verify(contractAddress, args) {
  const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
      })
    } catch (e) {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log("Already Verified!")
      } else {
        console.log(e)
      }
    }
  }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
