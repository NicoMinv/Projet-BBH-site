'use client'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from "./page.module.css";
import Menu from '@/components/Menu'
import Card from '@/components/ Card'
import Image from 'next/image';
import Marchand_de_biens from './Marchand_de_biens/page';

const menuItems = ['Market place', 'Defi', 'Marchand de bien', 'Marche secondaire']
const leftMenuItems = ['Earn', 'Colletarize', 'Borrow']
const rightItems = ['Investir', 'Mise en vente'];


const cards = [
    { title: 'Projet 1', image: '/Immeuble_1.jpg', subtitle: "Financement projet d'immeuble à ..."},
    { title: 'Projet 2', image: '/lien_2.jpg', subtitle: 'Financement projet maison'},
    { title: 'Projet 3', image: '/lien_5.jpg', subtitle: "Financer le projet d'achat ... "}
];
const secondaryMarketCards = [
    { 
        title: 'Projet A', 
        image: '/lien_6.jpg', 
        subtitle: "Investir",
        onInvestClick: () => console.log('Investissement dans le Projet A')
    },
    { 
        title: 'Projet B', 
        image: '/lien_9.jpg', 
        subtitle: "Investir",
        onInvestClick: () => console.log('Investissement dans le Projet B')
    }
];


export default function Home() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[0])
  const [selectedLeftMenuItem, setSelectedLeftMenuItem] = useState(rightItems[0])
    const [account, setAccount] = useState(''); // Pour le compte metamask connecté

    // Fonction pour se connecter à MetaMask
    const connectMetaMask = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]); // Stockez l'adresse du premier compte dans l'état
            } catch (error) {
                console.error('Erreur lors de la connexion à MetaMask:', error);
            }
        } else {
            alert('MetaMask n\'est pas installé. Veuillez l\'installer pour continuer.');
        }
    };

    // Utilisez useEffect pour connecter automatiquement si MetaMask est déjà autorisé
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(accounts => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                    }
                });
        }
    }, []);

    return (
        <>
            <div className='compo'>
                <Image src="/Logo_BBH_2.png" width={60} height={60} />

                <div className='flex-items'>
                    <div className='flex-items-1'>
                        <div className=''>
                            {/* Remplacez l'input par un bouton pour se connecter à MetaMask */}
                            {account ? (
                                <input type="text" value={account} className='custom-input' readOnly />
                            ) : (
                                <button onClick={connectMetaMask} className='custom-input'>
                                    Connecter MetaMask
                                </button>
                            )}
                        </div>
                        <Image src="/profil.svg" width={60} height={60} />
                        <h1> Mon Compte </h1>
                    </div>
                </div>

            </div>
                
    <main className={styles.main}>
        <Menu menuItems={menuItems} setSelectedMenuItem={setSelectedMenuItem} selectedMenuItem={selectedMenuItem}/>

        <div className={styles.contentWrapper}>
            {selectedMenuItem === 'Defi' && <div className={styles.leftMenu}>
                <Menu isVertical menuItems={leftMenuItems} setSelectedMenuItem={setSelectedLeftMenuItem}
                      selectedMenuItem={selectedLeftMenuItem}/>
        </div>}
        
        <div className={styles.content}>


        {selectedMenuItem === 'Market place' && (
            <div className={styles.cardContainer}>
                {cards.map((card, index) => (
                <Card 
                    key={index}
                    title={card.title} 
                    image={card.image} 
                    subtitle={card.subtitle}
                />
         ))}
        </div>
    )}

        {selectedMenuItem === 'Marchand de bien' && (
              <Marchand_de_biens />
            )}
        {selectedMenuItem === 'Marche secondaire' &&
              (
                  <div className='flex-item'>
                    <div className=''>
                            <div className={styles.leftMenu}>
                                <Menu className="alpine" isVertical menuItems={rightItems} setSelectedMenuItem={setSelectedLeftMenuItem}
                                    selectedMenuItem={selectedLeftMenuItem}/>
                            </div>

                    </div> 
                
                    {selectedLeftMenuItem === "Investir" ? (
                        <div className={styles.cardContainer}>
                            {secondaryMarketCards.map((card, index) => (
                            <Card 
                                key={index}
                                title={card.title}
                                image={card.image}
                                subtitle={card.subtitle}
                                onInvestClick={card.onInvestClick}
                    />
                ))}
            </div>
        ) : (
                            <div className='custom-placement'>
                                <h1>Token A : 1500
                                </h1>
                            </div>
                        )
                    }
                </div>
            )
            }


    </div>
        </div>
            </main>
</>
  );
}