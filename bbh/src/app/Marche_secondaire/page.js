'use client'

import Menu from '@/components/Menu'
import { useState } from 'react'
import styles from "../page.module.css";
const menuItems = ['Market place', 'Defi', 'Mon Dashboard', 'Marché secondaire']
const leftMenuItems = ['Earn', 'Colletarize', 'Borrow']

const cards = [{ title: '', image: ''}, { title: '', image: ''}, { title: '', image: ''}]


export default function Home() {

  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[0])
  const [selectedLeftMenuItem, setSelectedLeftMenuItem] = useState(leftMenuItems[0])

  return (<main className={styles.main}>
<Menu menuItems={menuItems} setSelectedMenuItem={setSelectedMenuItem} selectedMenuItem={selectedMenuItem}/>;
  </main>)
}

