const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NewTokenModule", (m) => {
  const cap = m.getParameter("cap", 100000000);
  const reward = m.getParameter("reward", 50);
  const initialToken = m.contract("NewToken", [cap, reward]);

  return { initialToken };
});
