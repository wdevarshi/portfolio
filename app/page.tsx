import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Experience from '../components/Experience'
import Skills from '../components/Skills'

export default function Home() {
  return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <Hero />
        <Experience />
        <Skills />
      </main>
  )
}
