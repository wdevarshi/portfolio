'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navItems = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
]

export default function Navbar() {
    const [active, setActive] = useState('')
    const [mobileOpen, setMobileOpen] = useState(false)

    const scrollToSection = (sectionId: string) => {
        setActive(sectionId)
        setMobileOpen(false)
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center h-14">
                    <Link href="/" className="font-semibold text-lg text-gray-900">
                        DW
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`text-sm transition-colors ${
                                    active === item.id
                                        ? 'text-gray-900 font-medium'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                        <Link
                            href="/tools"
                            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                            onClick={() => setActive('')}
                        >
                            Tools
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    active === item.id
                                        ? 'text-gray-900 font-medium bg-gray-50'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                        <Link
                            href="/tools"
                            className="block w-full text-left px-3 py-2 rounded text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                                setActive('')
                                setMobileOpen(false)
                            }}
                        >
                            Tools
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
