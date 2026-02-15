import Link from 'next/link'
import {ArrowUpRight} from 'lucide-react'

const tools = [
    {
        title: 'JSON Parser',
        description: 'Parse, validate, format, and minify JSON data. Syntax highlighting, error detection, and copy support.',
        href: '/tools/json-parser',
        external: false,
    },
    {
        title: 'CSV to JSON',
        description: 'Convert CSV data to JSON. Drag-and-drop file upload, header detection, automatic type inference.',
        href: '/tools/csv-to-json',
        external: false,
    },
    {
        title: 'UUID Generator',
        description: 'Generate v4 UUIDs with formatting options. Quotes, separators, and click-to-copy on each UUID.',
        href: '/tools/uuid-generator',
        external: false,
    },
    {
        title: 'TypeAI',
        description: 'Discover your AI personality type. A quick quiz mapping how you interact with AI tools across 5 dimensions.',
        href: 'https://typeai-tau.vercel.app',
        external: true,
    },
    {
        title: 'JWT Decoder',
        description: 'Paste a JWT token, instantly see the decoded header, payload, and expiry status. Color-coded sections with copy support.',
        href: '/tools/jwt-decoder',
        external: false,
    },
    {
        title: 'Base64 Encode/Decode',
        description: 'Real-time bidirectional Base64 conversion. Type in either side and see the result instantly.',
        href: '/tools/base64',
        external: false,
    },
    {
        title: 'Epoch Converter',
        description: 'Convert between Unix timestamps and human-readable dates. Auto-detects seconds or milliseconds, multiple output formats.',
        href: '/tools/epoch-converter',
        external: false,
    },
    {
        title: 'Hash Generator',
        description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text. All computed client-side with copy support.',
        href: '/tools/hash-generator',
        external: false,
    },
    {
        title: 'Regex Tester',
        description: 'Live regex matching with highlighting, match groups, and quick-insert patterns for common use cases.',
        href: '/tools/regex-tester',
        external: false,
    },
    {
        title: 'Cron Builder',
        description: 'Visual cron expression builder with human-readable descriptions, next run times, and common presets.',
        href: '/tools/cron-builder',
        external: false,
    },
]

export default function Tools() {
    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tools</h1>
                <p className="text-gray-500 mb-10">Developer utilities I built and use regularly.</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.map((tool) => (
                        <Link
                            key={tool.title}
                            href={tool.href}
                            target={tool.external ? '_blank' : undefined}
                            rel={tool.external ? 'noopener noreferrer' : undefined}
                            className="group block bg-white border border-gray-200 rounded-lg p-6
                                       hover:border-gray-400 hover:shadow-sm transition-all duration-150"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-black">
                                    {tool.title}
                                </h2>
                                {tool.external && (
                                    <ArrowUpRight size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                                )}
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {tool.description}
                            </p>
                        </Link>
                    ))}

                </div>
            </div>
        </main>
    )
}
