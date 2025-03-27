const { expect } = require("chai");
const { ethers, network } = require("hardhat");

// Import GeniData instance from geni-data
const geniData = require("../../geni_data/index.js");

describe("GeniToken Address Validation and Interaction", function () {
  let geniTokenAddress;

  before(async function () {
    const networkName = network.name; // Get network name from Hardhat runtime environment
    console.log(`Running tests on network: ${networkName}`);

    // Fetch the GeniToken address for the specified network
    geniTokenAddress = geniData.getGeniTokenAddress(networkName);
    console.log(`Fetched GeniToken address for ${networkName}:`, geniTokenAddress);
  });

  // Test 1: Validate the fetched GeniToken address
  it("should retrieve a valid GeniToken address from geni-data", function () {
    // Check if address is retrieved and valid
    expect(geniTokenAddress, "GeniToken address should not be null").to.not.be.null;
    expect(typeof geniTokenAddress).to.equal("string");
    expect(ethers.isAddress(geniTokenAddress), "Should be a valid Ethereum address").to.be.true;
  });

  // Test 2: Connect to the GeniToken contract and verify properties
  it("should connect to GeniToken contract and verify its details", async function () {
    // Create a contract instance
    const GeniToken = await ethers.getContractFactory("GeniToken");
    const geniToken = await GeniToken.attach(geniTokenAddress);

    // Fetch and verify contract properties
    const name = await geniToken.name();
    const symbol = await geniToken.symbol();
    const totalSupply = await geniToken.totalSupply();

    // Assertions
    expect(name).to.equal("Geni Token", "Token name should match");
    expect(symbol).to.equal("GENI", "Token symbol should match");
    expect(totalSupply.toString()).to.equal(
      "10000000000" + "0".repeat(18),
      "Total supply should be 10 billion tokens"
    );
  });
});