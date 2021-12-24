const hre = require("hardhat");

async function main() {
  const ERC20 = await hre.ethers.getContractFactory("Mutahhir");
  const erc20 = await ERC20.deploy();

  await erc20.deployed();

  console.log("Greeter deployed to:", erc20.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
