import React from 'react'
import styles from './index.module.css'
import Image from 'next/image'

const Card = ({title, image, subtitle}) => {

  return (
    <div className={styles.card}>
        <Image className={styles.cardImage} src={'/src/kfjsdhkjfhskjfh'} width={200} height={200}/>
        <div className={styles.cardBottom}>
            <div className={styles.title}>{title}</div>
            <div className={styles.subtitle}>{subtitle}</div>
        </div>
    </div>)
}

export default Card
