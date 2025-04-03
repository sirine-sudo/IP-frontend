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

    if (!tokenId || isNaN(tokenId)) {
      alert("❌ tokenId invalide ou vide !");
      return;
    }

    const owner = await contract.ownerOf(tokenId);
    const sender = await signer.getAddress();
    console.log("👤 Owner:", owner);
    console.log("🧾 Sender:", sender);

    if (owner.toLowerCase() !== sender.toLowerCase()) {
      alert("❌ Ce compte n'est pas le propriétaire du NFT.");
      return;
    }

    const currentUri = await contract.tokenURI(tokenId);
    console.log("🔍 URI actuelle :", currentUri);

    if (currentUri === newUri) {
      alert("❌ L'URI est déjà identique. Aucun changement.");
      return;
    }

    const tx = await contract.updateMetadata(tokenId, newUri);
    await tx.wait();

    alert("✅ Metadonnées mises à jour !");
  } catch (err) {
    console.error("Erreur updateMetadata :", err);
    alert("❌ Erreur pendant la mise à jour.");
  }
}
