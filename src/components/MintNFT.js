import { ethers } from "ethers";
import contractABI from "../abis/MyNFT.json";
import axios from "axios";

const CONTRACT_ADDRESS = "0xFD2FE145c0a64982Ebfa41De320FA80846DFAb7A";

export default async function MintNFT(tokenURI, ipId) {
  if (!window.ethereum) {
    alert("🦊 MetaMask est requis !");
    return;
  }

  if (!ipId) {
    alert("❌ L'identifiant de l'IP est manquant !");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    const userAddress = await signer.getAddress();

    const tx = await contract.mintNFT(userAddress, tokenURI);
    const receipt = await tx.wait();

    const transferEvent = receipt.events.find((e) => e.event === "Transfer");
    const tokenId = transferEvent.args.tokenId.toString();

    // ✅ Envoie tokenId et owner au backend
    await axios.put(`http://localhost:5000/api/ips/${ipId}/update-token`, {
      nft_token_id: tokenId,
      owner_address: userAddress,
    });

    console.log("✅ NFT Minté avec tokenId :", tokenId);
    alert(`✅ NFT Minté avec succès ! ID : ${tokenId}`);
  } catch (error) {
    console.error("Erreur pendant le mint :", error);
    alert("❌ Erreur pendant le mint. Voir la console.");
  }
}
