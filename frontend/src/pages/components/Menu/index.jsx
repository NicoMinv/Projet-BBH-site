'use client'
import React from 'react'
import styles from './index.module.css'
import MenuItem from '@/components/MenuItem'


const Menu = ( { isVertical, menuItems, setSelectedMenuItem, selectedMenuItem }) => {

  return (
      <div className={`${styles.menuContainer} ${isVertical ? styles.vertical : ''}`} >
          {menuItems.map((item, index) => (
              <div key={index} onClick={() => setSelectedMenuItem(item)}>
                  <MenuItem isBorderLeft={isVertical} title={item} isSelected={selectedMenuItem === item}/>
              </div>
          ))}
      </div>
  )
}

export default Menu
