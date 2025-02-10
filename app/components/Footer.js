'use client'
import { usePathname } from 'next/navigation';
import React from 'react'


const Footer = () => {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');

    return (
        <div>
            <div className={isAdminPage ? "bg-gradient-to-r bg-gray-800 py-2" : "bg-gradient-to-r from-yellow-500 to-yellow-600 py-2"}>
                <div className="container mx-auto flex justify-center space-x-4 items-center text-white">
                    Copyright © 2024 - All Rights Reserved. A Product of Ahsan Ali Soomro.
                </div>
            </div>
        </div>
    )
}

export default Footer
