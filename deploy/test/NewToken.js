const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NewToken", function () {
  //global vars
  let Token, newToken, owner, addr1, addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    // get contract factory and singer here
    Token = await ethers.getContractFactory("NewToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    newToken = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await newToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of token to the owner", async function () {
      const balance = await newToken.balanceOf(owner.address);
      expect(await newToken.totalSupply()).to.equal(balance);
    });

    it("Should set the max capped supply to the agrument provided during deployment", async function () {
      const cap = await newToken.cap();
      //   console.log("cap:", cap);clear
      //   console.log("cap:", Number(ethers.utils.formatEther(cap)));
      //   expect(cap).to.equal(tokenCap);
      expect(Number(ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await newToken.blockReward();
      expect(Number(ethers.utils.formatEther(blockReward))).to.equal(
        tokenBlockReward
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await newToken.balanceOf(owner.balance);

      // Transfer 100 tokens from owner address 1
      await newToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from ower to addres 2
      await newToken.transfer(addr2.address, 50);

      // check balance
      const finalOwnerBalance = await newToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await newToken.balanceOf(add1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await newToken.balanceOf(add2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail it sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await newToken.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        newToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ErC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed
      expect(await newToken.balance(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfer", async function () {
      const initialOwnerBalance = await newToken.balanceOf(owner.address);

      console.log("initialOwnerBalance: %", initialOwnerBalance);

      // transfer 100 tokens from owner to address1
      await newToken.transfer(addr1, 100);

      // transfer another 50 tokens from owner to address2
      await newToken.transfer(addr2, 50);

      // check balances
      const finalOwnerBalance = await newToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await newToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await newToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
