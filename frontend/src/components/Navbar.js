import React from "react";
import { useWallet } from "../context/WalletContext";

function Navbar() {
  const wallet = useWallet();

  // 🛡️ Safety check (prevents crash)
  if (!wallet) return null;

  const { address, connectWallet } = wallet;

  return (
    <nav className="navbar">
      <h2>SocialFund</h2>

      {address ? (
        <span>
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </nav>
  );
}

export default Navbar;
