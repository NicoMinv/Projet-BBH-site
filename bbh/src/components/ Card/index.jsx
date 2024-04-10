// Card.jsx
import React from 'react';
import styles from './index.module.css';
import Image from 'next/image';

const Card = ({ title, image, subtitle, onInvestClick }) => {
    return (
        <div className={styles.card}>
            <Image className={styles.cardImage} src={image} alt="Image de projet" width={200} height={200} />
            <div className={styles.cardContent}>
                <div className={styles.cardTitle}>{title}</div>
                <div className={styles.cardSubtitle}>{subtitle}</div>
            </div>
            {onInvestClick && (
                <div className={styles.cardButtonContainer}>
                    <button onClick={onInvestClick} className={styles.investButton}>
                        INVESTIR
                    </button>
                </div>
            )}
        </div>
    );
};

export default Card;
