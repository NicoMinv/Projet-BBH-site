import React from 'react'
import styles from './index.module.css'


const HorizontalBar = ({ title, filledValue }) => {

  return (
    <div className={styles.horizontalBarContainer}>
      <div className={styles.title}>{title}</div>
      <div className={styles.horizontalBar} >

      </div>

    </div>)
}

export default HorizontalBar
