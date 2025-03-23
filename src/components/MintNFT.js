import { BrowserProvider, Contract } from "ethers";
import contractABI from "../abis/MyNFT.json"; // Assure-toi du bon chemin

console.log("ABI du contrat:", contractABI); // 🔍 Vérifie l'ABI

const CONTRACT_ADDRESS = "0xFD2FE145c0a64982Ebfa41De320FA80846DFAb7A"; // Ton adresse de contrat
export default async function MintNFT(tokenURI) {
  if (!window.ethereum) {
    alert("MetaMask est requis !");
    return;
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

  try {
    const tx = await contract.mintNFT(await signer.getAddress(), tokenURI);
    await tx.wait();
    console.log(`✅ NFT Minté avec succès : https://sepolia.etherscan.io/tx/${tx.hash}`);
alert(`NFT Minté ! Voir la transaction : https://sepolia.etherscan.io/tx/${tx.hash}`);

    alert("NFT Minté !");
  } catch (error) {
    console.error("❌ Erreur lors du minting :", error);
  }
}
