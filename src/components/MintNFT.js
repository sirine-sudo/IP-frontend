import { BrowserProvider, Contract } from "ethers";
import contractABI from "../abis/MyNFT.json"; //  Assure-toi du bon chemin

const CONTRACT_ADDRESS = "0xFD2FE145c0a64982Ebfa41De320FA80846DFAb7A";

export default async function MintNFT(tokenURI) {
  if (!window.ethereum) {
    alert("🦊 MetaMask est requis !");
    return;
  }

  try {
    console.log(" Connexion à MetaMask...");
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    console.log(" Adresse utilisateur :", userAddress);

    const contract = new Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

    console.log(" Chargement du contrat...");
    console.log(" Adresse du contrat :", CONTRACT_ADDRESS);
    console.log(" Nom du contrat :", await contract.name());
    console.log(" Symbole du contrat :", await contract.symbol());

    console.log(" Envoi du mint...");
    const tx = await contract.mintNFT(userAddress, tokenURI);
    console.log(" Transaction envoyée :", tx.hash);

    await tx.wait();
    console.log(` NFT Minté ! Tx : https://sepolia.etherscan.io/tx/${tx.hash}`);

    alert(`NFT Minté ! Voir la transaction : https://sepolia.etherscan.io/tx/${tx.hash}`);
  } catch (error) {
    console.error(" Erreur pendant le mint :", error);
    alert("Une erreur est survenue. Voir la console.");
  }
}
