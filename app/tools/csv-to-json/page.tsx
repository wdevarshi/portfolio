import CSVtoJSON from '@/components/CSVtoJSON'
import Link from 'next/link'

export default function CSVtoJSONPage() {
    return (
        <main className="min-h-screen bg-gray-50 p-4">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">CSV to JSON</h1>
                        <Link
                            href="/tools"
                            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Back to Tools
                        </Link>
                    </div>
                    <CSVtoJSON/>
                </div>
            </div>
        </main>
    )
}
