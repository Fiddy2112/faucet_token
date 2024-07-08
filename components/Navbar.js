import React from "react";

const Navbar = ({
  connectWallet,
  address,
  walletAddress,
  disconnectWallet,
}) => {
  return (
    <div className="mt-2">
      <div className="lg:container lg:mx-auto mx-2 mt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-medium font-mono text-white">
              SenpaiToken (ST)
            </h1>
          </div>
          <div>
            <button onClick={walletAddress ? disconnectWallet : connectWallet}>
              {walletAddress && walletAddress.length > 0
                ? address
                : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
