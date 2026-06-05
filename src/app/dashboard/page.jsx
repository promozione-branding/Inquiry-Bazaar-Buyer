import BuyerSidebar from '@/components/Buyer/BuyerSidebar'
import React from 'react'
import Dashboard from './Dashboard'

export default function page() {
    return (<div className='flex'>
        <BuyerSidebar />
        <Dashboard />
    </div>)
}
