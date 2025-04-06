import { ethers } from "ethers";
import contractABI from "../abis/MyNFT.json";

const CONTRACT_ADDRESS = "0x525fFff54Cc4a2E33C9aD562B609B29a2983De61";

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
    if (!ip.nft_token_id || ip.nft_token_id === "pending") {
      alert("❌ Ce NFT n’a pas encore été minté.");
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
