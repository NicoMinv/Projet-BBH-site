'use client'
import { useState } from 'react'
import styles from "./page.module.css";
import Menu from '@/components/Menu'
import Card from '@/components/ Card'

const menuItems = ['Market place', 'Defi', 'Mon Dashboard', 'Marché secondaite']
const leftMenuItems = ['Earn', 'Colletarize', 'Borrow']

const cards = [{ title: '', image: ''}, { title: '', image: ''}, { title: '', image: ''}]
export default function Home() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[0])
  const [selectedLeftMenuItem, setSelectedLeftMenuItem] = useState(leftMenuItems[0])


  return (
    <main className={styles.main}>
        <Menu menuItems={menuItems} setSelectedMenuItem={setSelectedMenuItem} selectedMenuItem={selectedMenuItem}/>

        <div className={styles.contentWrapper}>
            {selectedMenuItem === 'Defi' && <div className={styles.leftMenu}>
                <Menu isVertical menuItems={leftMenuItems} setSelectedMenuItem={setSelectedLeftMenuItem}
                      selectedMenuItem={selectedLeftMenuItem}/>
            </div>}

            <div className={styles.content}>
                {selectedMenuItem === 'Market place' && <div className={styles.cardContainer}>
                    {cards.map((card, index) =>
                        <Card title={'Project ' + index} subtitle={'sectondary text'}/>
                    )}
                </div>}
                {/*<HorizontalBar />*/}

            </div>
        </div>
    </main>
  );
}
