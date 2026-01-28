import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    const prov = new ethers.BrowserProvider(window.ethereum);
    const signer = await prov.getSigner();
    const addr = await signer.getAddress();

    setProvider(prov);
    setAddress(addr);
  };

  return (
    <WalletContext.Provider value={{ address, provider, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
