import BuyerSidebar from '@/components/Buyer/BuyerSidebar'
import React from 'react'
import Help from './Help'

export default function page() {
    return (<div className='flex'>
        <BuyerSidebar />
        <Help />
    </div>)
}
