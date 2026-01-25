import { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

function ConnectWallet() {
  const [account, setAccount] = useState("");

  async function connectWallet() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    setAccount(await signer.getAddress());
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>{account}</p>
    </div>
  );
}

export default ConnectWallet;
