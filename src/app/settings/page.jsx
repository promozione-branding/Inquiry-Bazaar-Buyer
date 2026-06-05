import BuyerSidebar from '@/components/Buyer/BuyerSidebar'
import React from 'react'
import Settings from './Settings'

export default function page() {
    return (<div className='flex'>
        <BuyerSidebar />
        <Settings />
    </div>)
}
