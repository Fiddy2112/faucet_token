import Image from "next/image";
import { Inter, Sigmar } from "next/font/google";
import { ethers } from "ethers";
import faucetContract from "@/utils/Faucet";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { showAddress } from "@/utils/Features";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");
  const [driverPopup, setDriverPopup] = useState(false);

  // driver popup

  useEffect(() => {
    if (walletAddress) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: ".hero",
            popover: {
              title: `Wellcome ${showAddress(walletAddress)}`,
              description: "This is dex faucet SenpaiToken (ST)",
            },
          },
          {
            element: ".inp",
            popover: {
              title: "Enter your address",
              description:
                "You can enter the address or use the address from the metamask",
            },
          },
          {
            element: ".submitt",
            popover: {
              title: "Click when finished",
              description: "Here you can faucet on click",
            },
          },
          {
            element: ".trans",
            popover: {
              title: "Return Transaction",
              description: "Returns your transaction data",
            },
          },
        ],
      });

      driverObj.drive();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      currentWalletConnected();
      walletListener();
    } else {
      disconnectWallet();
      // setWalletAddress();
      // setSigner();
      // setContract();
    }
  }, [walletAddress]);

  const connectWallet = async () => {
    try {
      if (
        typeof window != "undefined" &&
        typeof window.ethereum != "undefined"
      ) {
        // get provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // get accounts
        const accounts = await provider.send("eth_requestAccounts", []);
        // get signer
        const signer = provider.getSigner();
        setSigner(signer);
        // contract instance
        setContract(faucetContract(provider));

        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } else {
        console.log("Please install Metamask");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setSigner();
    setContract();
  };

  const currentWalletConnected = async () => {
    try {
      if (
        typeof window != "undefined" &&
        typeof window.ethereum != "undefined"
      ) {
        // get provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // get accounts
        const accounts = await provider.send("eth_accounts", []);

        if (accounts.length > 0) {
          // get signer
          const signer = provider.getSigner();
          setSigner(signer);
          console.log(signer);
          // contract instance
          setContract(faucetContract(provider));

          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to Metamask using the connect button");
        }
      } else {
        console.log("Please install Metamask");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const walletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(account[0]);
      });
    } else {
      console.log("Please install Metamask");
    }
  };

  const getTokenHandle = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      const contractWithSigner = contract.connect(signer);
      const resp = await contractWithSigner.requestToken();
      console.log(resp);
      setWithdrawSuccess("Operation successded - enjoy your tokens");
      setTransactionData(resp.hash);
    } catch (err) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };

  return (
    <div className="hero">
      <Navbar
        connectWallet={connectWallet}
        address={showAddress(walletAddress)}
        walletAddress={walletAddress}
        disconnectWallet={disconnectWallet}
      />
      <section className="mx-auto my-0">
        <div className="mt-2">
          <div className="text-center">
            <h1 className="text-2xl font-mono">Faucet</h1>
            <p className="my-1 font-mono">Fast and reliable 50 ST/day</p>
            <div className="my-1">
              {withdrawError && (
                <div className="text-sm font-mono text-red-800">
                  {withdrawError}
                </div>
              )}
              {withdrawSuccess && (
                <div className="text-sm font-mono text-lime-900">
                  {withdrawSuccess}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="inp">
              <input
                className=" px-2 py-2 md:w-72 w-60 lg:w-[340px] font-mono text-sm outline-none text-black"
                type="text"
                placeholder="Enter your wallet address (0x...)"
                defaultValue={walletAddress}
              />
            </div>
            <div className="submitt">
              <button
                className="px-2 py-2 lg:py-1 bg-slate-900 font-mono text-sm lg:text-lg"
                onClick={getTokenHandle}
                disabled={walletAddress ? false : true}
              >
                Get Tokens
              </button>
            </div>
          </div>
          <article className="trans mx-auto my-0 text-center">
            <p className="w-[455px] bg-slate-900 font-mono lg:text-xl text-sm mx-auto mt-2 p-1">
              Transaction Data
            </p>
            <div>
              <p>
                {transactionData
                  ? `Transaction Hash : ${transactionData}`
                  : "--"}
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
