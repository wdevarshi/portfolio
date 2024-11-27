import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import BigWins from '../components/BigWins'
import Image from 'next/image'

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar/>
            <section className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="w-248 h-248 rounded-full overflow-hidden relative">
                            <Image
                                src="/profilephoto.jpg"
                                alt="Devarshi Waghela"
                                width={300}
                                height={300}
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="md:flex-1 max-w-11xl">
                            <Hero/>
                        </div>
                    </div>
                </div>
            </section>
            <BigWins/>
            <Experience/>
            <Skills/>
        </main>
    )
}
