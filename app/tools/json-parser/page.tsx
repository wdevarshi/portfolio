import JsonParser from '@/components/JsonParser'
import Link from 'next/link'

export default function JsonParserPage() {
    return (
        <main className="min-h-screen bg-gray-50 p-4">
            <div className="container mx-auto max-w-11xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">JSON Parser</h1>
                        <Link
                            href="/tools"
                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                        >
                            Back to Tools
                        </Link>
                    </div>
                    <JsonParser/>
                </div>
            </div>
        </main>
    )
}