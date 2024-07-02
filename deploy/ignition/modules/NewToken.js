const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NewTokenModule", (m) => {
  const initialToken = m.contract("NewToken");

  return { initialToken };
});
