import BuyerSidebar from '@/components/Buyer/BuyerSidebar'
import React from 'react'
import Profile from './Profile'

export default function page() {
    return (<div className='flex'>
        <BuyerSidebar />
        <Profile />
    </div>)
}
