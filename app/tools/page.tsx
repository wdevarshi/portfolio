// app/tools/page.tsx
export default function Tools() {
    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold mb-8">Tools & Utilities</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* JSON Parser Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">JSON Parser</h2>
                        <p className="text-gray-600 mb-4">
                            Parse, validate, and format JSON data with ease. Features include syntax highlighting,
                            error detection, and pretty printing.
                        </p>
                        <a
                            href="/tools/json-parser"
                            className="inline-block px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                        >
                            Open Tool
                        </a>
                    </div>
                    {/* CSV to JSON Convertor */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">CSV to JSON Converter</h2>
                        <p className="text-gray-600 mb-4">
                            Convert CSV data to JSON format with ease. Features include header detection,
                            automatic type inference, and clean formatting.
                        </p>
                        <a
                            href="/tools/csv-to-json"
                            className="inline-block px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                        >
                            Open Tool
                        </a>
                    </div>
                    {/* UUID Generator */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">UUID Generator</h2>
                        <p className="text-gray-600 mb-4">
                            Generate valid UUIDs with ease. Features include version 4 - UUID generation.
                            Copy to clipboard functionality is also available.
                        </p>
                        <a
                            href="/tools/uuid-generator"
                            className="inline-block px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                        >
                            Open Tool
                        </a>
                    </div>
                    {/* TypeAI */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">TypeAI</h2>
                        <p className="text-gray-600 mb-4">
                            Discover your AI personality type. A quick quiz that maps how you interact
                            with AI tools across 5 dimensions, giving you one of 32 unique profiles.
                        </p>
                        <a
                            href="https://typeai-tau.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                        >
                            Try It
                        </a>
                    </div>
                    {/* Placeholder for future tools */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300">
                        <h2 className="text-xl font-semibold mb-4 text-gray-400">More Coming Soon</h2>
                        <p className="text-gray-400 mb-4">
                            Additional tools are in development. Stay tuned for updates!
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}