'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
    const [active, setActive] = useState('')

    const scrollToSection = (sectionId: string) => {
        setActive(sectionId)
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex-shrink-0 font-bold text-xl">
                        DW
                    </Link>
                    <div className="hidden md:flex space-x-8">
                        {[
                            {id: 'about', label: 'About'},
                            {id: 'experience', label: 'Experience'},
                            {id: 'skills', label: 'Skills'},
                            {id: 'projects', label: 'Projects'}
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`text-gray-600 hover:text-gray-900 ${
                                    active === item.id ? 'text-blue-600 font-medium' : ''
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                        <Link
                            href="/tools"
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => setActive('')} // Reset active state when navigating away
                        >
                            Tools
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}