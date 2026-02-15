'use client'

import { Github, Linkedin, Mail, Phone, Instagram } from 'lucide-react'

export default function Hero() {
    return (
        <section id="about" className="py-12 md:py-0">
            <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                    Devarshi Waghela
                </h1>
                <h2 className="text-lg md:text-xl text-gray-500 mb-6">
                    Head of Software Engineering at Respiree
                </h2>
                <p className="text-base text-gray-600 mb-8 leading-relaxed">
                    Experienced in building highly scalable, available and distributed
                    backend micro-services. Skilled in Java, Golang, Typescript, and Python.
                </p>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-6">
                    <a
                        href="tel:+6586191150"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
                    >
                        <Phone className="h-4 w-4" />
                        <span>+65 8619 1150</span>
                    </a>
                    <a
                        href="mailto:devarshi@devarshiwaghela.com"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
                    >
                        <Mail className="h-4 w-4" />
                        <span>devarshi@devarshiwaghela.com</span>
                    </a>
                </div>

                <div className="flex justify-center md:justify-start items-center space-x-5">
                    <a
                        href="https://github.com/wdevarshi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <Github className="h-5 w-5" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/wagheladevarshi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                        href="https://www.instagram.com/wagheladevarshi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <Instagram className="h-5 w-5" />
                    </a>
                </div>
            </div>
        </section>
    )
}
