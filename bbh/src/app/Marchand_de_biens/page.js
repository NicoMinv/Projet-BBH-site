import React, { useState } from 'react';
import styles from "../page.module.css";
import { ethers } from 'ethers';
import assetTokenization from './AssetTokenization.json';
const abi = assetTokenization.abi;



const contractAddress = "0x4516E23507F4D3FfDA0e053817263B123c3f979B"

const Marchand_de_biens = () => {
    const [creating, setCreating] = useState(false);


    async function createToken() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []); // Demande à MetaMask l'autorisation de se connecter
                const signer = provider.getSigner(); 
                
                const contract = new ethers.Contract(contractAddress, abi, signer);
    
                
                const transaction = await contract.createToken("Projet 4 ", "ALYRA", {
                    gasLimit: "1000000" // J'ai fixé ici le gaz limit car quand j'appelais ma fonction, il n'arrivait pas à estimer le cout en gaz. La valeur 100000 est arbitraire ici. 
                });
                await transaction.wait();
    
                console.log("Token créé avec succès!");
            } catch (error) {
                console.error('Erreur lors de la création du token:', error);
            }
        } else {
            console.log("Veuillez installer MetaMask pour utiliser cette fonctionnalité.");
        }
    }
    

    return (
        <div className={styles.marchandDeBiensContainer}>
    <p>Créez un nouveau token de projet:</p>
    <button 
        onClick={createToken} 
        className={styles.createTokenButton} 
        disabled={creating}
    >
        {creating ? 'Création en cours...' : 'Créer Token'}
    </button>
</div>
    );
}

export default Marchand_de_biens;
