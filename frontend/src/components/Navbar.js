import React from "react";

function Navbar({ connectWallet, account }) {
  return (
    <div className="navbar">
      <h1>🚀 CrowdFunding DApp</h1>
      <button onClick={connectWallet}>
        {account ? account.slice(0,6)+"..." : "Connect Wallet"}
      </button>
    </div>
  );
}

export default Navbar;
