'use client'
import { useState } from 'react'
import styles from "./page.module.css";
import Menu from '@/components/Menu'
import Card from '@/components/ Card'
import Image from 'next/image';
const menuItems = ['Market place', 'Defi', 'Mon Dashboard', 'Marche secondaire']
const leftMenuItems = ['Earn', 'Colletarize', 'Borrow']
const rightItems = ['Investir', 'Mise en vente'];

const cards = [{ title: '', image: ''}, { title: '', image: ''}, { title: '', image: ''}]
export default function Home() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[0])
  const [selectedLeftMenuItem, setSelectedLeftMenuItem] = useState(leftMenuItems[0])


  return (
    <>
    <div className='compo'>
        <Image src="/Logo_BBH_2.png" width={60} height={60}  />

        <div className='flex-items'>
            <div className='flex-items-1'>
                <div className=''>
                    <input type="text"   value="0x4..........12DE" className='custom-input'  />
                </div>
                <Image src="/profil.svg" width={60} height={60}  />
                <h1> Mon profile</h1>
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
                {selectedMenuItem === 'Market place' && <div className={styles.cardContainer}>
                    {cards.map((card, index) =>
                        <Card title={'Project ' + index} subtitle={'sectondary text'}/>
                    )}
        </div>
    }
    {selectedMenuItem === 'Marché' && <div className={styles.cardContainer}>
           {cards.map((card, index) =>
               <Card title={'Project ' + index} subtitle={'sectondary text'}/>
           )}
       </div>
   }
        {selectedMenuItem === 'Marche secondaire' &&
              (
                  <div className='flex-item'>
                    <div className=''>
                            <div className={styles.leftMenu}>
                                <Menu className="alpine" isVertical menuItems={rightItems} setSelectedMenuItem={setSelectedLeftMenuItem}
                                    selectedMenuItem={selectedLeftMenuItem}/>
                            </div>

                    </div> 
                    <div className={styles.cardContainer}>
                            {cards.map((card, index) =>
                                <Card title={'Project ' + index} subtitle={'sectondary text'}/>
                            )}
                        </div>
                </div>
            )
            }


    </div>
        </div>
            </main>
</>
  );
}
