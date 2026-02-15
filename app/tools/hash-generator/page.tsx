import Link from 'next/link'
import HashGenerator from '@/components/HashGenerator'

export default function HashGeneratorPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/tools" className="text-gray-500 hover:text-gray-900 text-sm mb-6 inline-block">&larr; Back to Tools</Link>
        <h1 className="text-3xl font-bold mb-8">Hash Generator</h1>
        <HashGenerator />
      </div>
    </main>
  )
}
