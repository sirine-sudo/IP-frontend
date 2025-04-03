import { ethers } from "ethers";
import contractABI from "../abis/MyNFT.json";

const CONTRACT_ADDRESS = "0xFD2FE145c0a64982Ebfa41De320FA80846DFAb7A";

export default async function updateMetadata(tokenId, newUri) {
  if (!window.ethereum) {
    alert("🦊 MetaMask requis !");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

    if (!tokenId || isNaN(parseInt(tokenId)) || parseInt(tokenId) <= 0) {
      alert("❌ tokenId invalide !");
      return;
    }
    
    const owner = await contract.ownerOf(tokenId);
    const sender = await signer.getAddress();

    console.log("🔍 Owner of token:", owner);
    console.log("🧾 Sender:", sender);
    console.log("⛓ tokenId:", tokenId);
    console.log("👛 connected:", sender);

    if (owner.toLowerCase() !== sender.toLowerCase()) {
      alert("❌ Vous n'êtes pas le propriétaire du NFT.");
      return;
    }

    const currentUri = await contract.tokenURI(tokenId);
    if (currentUri === newUri) {
      alert("❌ URI déjà à jour !");
      return;
    }

    console.log("📡 Sending updateMetadata with:", tokenId, newUri);

    const tx = await contract.updateMetadata(tokenId, newUri, {
      gasLimit: 300000, // ✅ fallback si estimation échoue
    });
    await tx.wait();

    alert("✅ Metadonnées mises à jour !");
  } catch (err) {
    console.error("Erreur updateMetadata :", err);
    alert("❌ Erreur pendant la mise à jour.");
  }
}
