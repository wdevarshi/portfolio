import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import BigWins from '../components/BigWins'
import Image from 'next/image'

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <section className="bg-white">
                <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                        <div className="shrink-0">
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden">
                                <Image
                                    src="/profilephoto.jpg"
                                    alt="Devarshi Waghela"
                                    width={224}
                                    height={224}
                                    className="object-cover w-full h-full"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <Hero />
                        </div>
                    </div>
                </div>
            </section>
            <Experience />
            <Skills />
            <BigWins />
        </main>
    )
}
