import { ethers } from "ethers";
import contractABI from "../abis/MyNFT.json";
import axios from "axios";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom"; 
const CONTRACT_ADDRESS = "0x525fFff54Cc4a2E33C9aD562B609B29a2983De61";

export default async function MintNFT(tokenURI, ipId) {
  if (!window.ethereum) {
    toast.error("🦊 MetaMask est requis !");
    return;
  }

  if (!ipId) {
    toast.error("❌ L'identifiant de l'IP est manquant !");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    const userAddress = await signer.getAddress();

    //  Connecter wallet utilisateur dans la BDD
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/users/connect-wallet",
      { ethereum_address: userAddress },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //  Informer utilisateur que le mint démarre
    toast.info("⏳ Mint en cours, veuillez patienter...");

    //  Envoyer le mint
    const tx = await contract.safeMint(userAddress, tokenURI);
    const receipt = await tx.wait();

    const transferEvent = receipt.events.find((e) => e.event === "Transfer");
    const tokenId = transferEvent.args.tokenId.toString();

    //  Mise à jour du tokenId dans ta base
    await axios.put(`http://localhost:5000/api/ips/${ipId}/update-token`, {
      nft_token_id: tokenId,
      owner_address: userAddress,
      smart_contract_address: CONTRACT_ADDRESS,
    });

    console.log(" NFT Minté avec tokenId :", tokenId);

    //  Success message
    toast.success(` NFT Minté avec succès ! ID : ${tokenId}`);

    //  Lien Sepolia (afficher transaction)
    const txLink = `https://sepolia.etherscan.io/tx/${receipt.transactionHash}`;
    toast.info(
      <a href={txLink} target="_blank" rel="noopener noreferrer" style={{ color: "#4CAF50", fontWeight: "bold" }}>
        🔗 Voir la transaction sur Sepolia
      </a>,
      { autoClose: 50000 }
    );

    //  Rediriger après un délai
    setTimeout(() => {
      window.location.href = "/marketplace"; 
    }, 4000); // laisse le temps de lire le lien
  } catch (error) {
    console.error("Erreur pendant le mint :", error);
    toast.error("❌ Erreur pendant le mint. Voir la console.");
  }
}
