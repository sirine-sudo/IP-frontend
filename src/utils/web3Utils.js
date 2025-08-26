import Web3 from "web3";

// Connect to MetaMask
export const connectMetaMask = async () => {
  if (!window.ethereum) throw new Error("MetaMask not detected");

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const web3 = new Web3(window.ethereum);
  return { web3, account: accounts[0] };
};
