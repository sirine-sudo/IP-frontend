import { useState } from "react";

export default function useWallet() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) throw new Error("Please install MetaMask");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    return accounts[0];
  };

  return { account, connectWallet };
}
