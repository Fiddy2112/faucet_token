const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FaucetModule", (m) => {
  const tokenAddress = m.getParameter(
    "tokenAddress",
    "0xEe7baA06499cC4ad84C1689Bc73B49892328FDe8"
  );
  const initialToken = m.contract("Faucet", [tokenAddress]);

  return { initialToken };
});
