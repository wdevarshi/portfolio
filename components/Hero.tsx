// // components/Hero.tsx
// import { Github, Linkedin, Mail } from 'lucide-react'
//
// export default function Hero() {
//     return (
//         <section id="about" className="py-20 bg-white">
//             <div className="max-w-4xl mx-auto text-center px-4">
//                 <h1 className="text-4xl md:text-6xl font-bold mb-6">Devarshi Waghela</h1>
//                 <h2 className="text-xl md:text-2xl text-gray-600 mb-8">
//                     Engineering Manager at Carousell
//                 </h2>
//                 <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
//                     Experienced in building highly available, distributed backend micro-services.
//                 </p>
//                 <div className="flex justify-center space-x-6">
//                     <a
//                         href="https://github.com/wdevarshi"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-gray-600 hover:text-gray-900"
//                     >
//                         <Github className="h-6 w-6" />
//                     </a>
//                     <a
//                         href="https://www.linkedin.com/in/wagheladevarshi/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-gray-600 hover:text-gray-900"
//                     >
//                         <Linkedin className="h-6 w-6" />
//                     </a>
//                     <a
//                         href="devarshi@devarshiwaghela.com"
//                         className="text-gray-600 hover:text-gray-900"
//                     >
//                         <Mail className="h-6 w-6" />
//                     </a>
//                 </div>
//             </div>
//         </section>
//     )
// }

'use client'

import { Github, Linkedin, Mail, Phone, Instagram } from 'lucide-react'

export default function Hero() {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-4xl mx-auto text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Devarshi Waghela</h1>
                <h2 className="text-xl md:text-2xl text-gray-600 mb-8">
                    Lead Engineer at BlueSG
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Experienced in building highly scalable, available and distributed backend micro-services.
                    Skilled in Java, Golang, Typescript, and Python.
                </p>

                {/* Contact Information */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                    <a
                        href="tel:+6586191150"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <Phone className="h-5 w-5" />
                        <span>+65 8619 1150</span>
                    </a>
                    <a
                        href="mailto:devarshi@devarshiwaghela.com"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <Mail className="h-5 w-5" />
                        <span>devarshi@devarshiwaghela.com</span>
                    </a>
                </div>

                {/* Social Links */}
                <div className="flex justify-center items-center space-x-6">
                    <a
                        href="https://github.com/wdevarshi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    >
                        <Github className="h-6 w-6" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/wagheladevarshi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    >
                        <Linkedin className="h-6 w-6" />
                    </a>
                    <a
                        href="https://www.instagram.com/wagheladevarshi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    >
                        <Instagram className="h-6 w-6" />
                    </a>
                </div>
            </div>
        </section>
    )
}