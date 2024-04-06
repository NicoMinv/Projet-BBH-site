import React from 'react'
import styles from './index.module.css'


const MenuItem = ({ isBorderLeft,  title, isSelected }) => {
  console.log("isSelected: ", isSelected)
  return (
    <div className={`${styles.menuItem} ${isSelected ? styles.selected : ''} ${isBorderLeft ? styles.borderLeft : ''} ${isBorderLeft && isSelected ? styles.borderLeftSelected : ''}`}>
        {title}
    </div>)
}

export default MenuItem
