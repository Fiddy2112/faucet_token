import { ethers } from "ethers";
import FaucetContract from "./Faucet.json";

const faucetAbi = FaucetContract.abi;

const faucetContract = (provider) => {
  return new ethers.Contract(
    "0xeBBEE3e3d0FDeBDB87085f57443F69E54E424e84",
    faucetAbi,
    provider
  );
};

export default faucetContract;
