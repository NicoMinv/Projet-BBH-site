import React, { useState } from 'react';
import styles from "../page.module.css";
import { ethers } from 'ethers';
import abi from './AssetTokenization.json';

const contractAddress = "0x2A378d2c784056aD72F0c59D87E91EDB829e5e3F"

const Marchand_de_biens = () => {
    const [creating, setCreating] = useState(false);


    const createToken = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const assetTokenizationContract = new ethers.Contract(contractAddress, abi, signer);
    
                const transaction = await assetTokenizationContract.createToken("NomDuToken", "SYMBOL");
                await transaction.wait();
    
                alert("Token créé avec succès !");
            } catch (error) {
                console.error('Erreur lors de la création du token:', error);
                alert("Erreur lors de la création du token.");
            }
        } else {
            alert("Veuillez installer MetaMask pour utiliser cette fonctionnalité.");
        }
    };
    

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
