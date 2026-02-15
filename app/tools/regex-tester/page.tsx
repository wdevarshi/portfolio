import Link from 'next/link'
import RegexTester from '@/components/RegexTester'

export default function RegexTesterPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/tools" className="text-gray-500 hover:text-gray-900 text-sm mb-6 inline-block">← Back to Tools</Link>
        <h1 className="text-3xl font-bold mb-8">Regex Tester</h1>
        <RegexTester />
      </div>
    </main>
  )
}
