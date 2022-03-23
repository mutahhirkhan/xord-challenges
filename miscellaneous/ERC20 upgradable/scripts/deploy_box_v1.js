// scripts/deploy_upgradeable_box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
    const signers = await ethers.getSigners();
    console.log("signers: ", signers.map(signer => signer.address));
    const Box = await ethers.getContractFactory("Box");
    console.log("Deploying Box...");
    const box = await upgrades.deployProxy(Box, [42], {
        initializer: "initialize",
    });
    await box.deployed();
    console.log("Box deployed to:", box.address);
}

main();
