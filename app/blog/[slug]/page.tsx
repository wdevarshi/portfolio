import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import PostContent from '../../../components/PostContent'
import { getPost, getAllSlugs } from '../../../lib/posts'
import { marked } from 'marked'

export async function generateStaticParams() {
    const slugs = getAllSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getPost(slug)
    if (!post) return {}
    return {
        title: `${post.title} — Devarshi Waghela`,
        description: post.excerpt,
    }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getPost(slug)
    if (!post) notFound()

    const renderer = new marked.Renderer()
    renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
        const escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
        return `<div class="not-prose"><pre><code class="language-${lang || 'plaintext'}">${escaped}</code></pre></div>`
    }
    const htmlContent = await marked(post.content, { renderer })

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-16">
                {/* Back link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-10"
                >
                    ← All posts
                </Link>

                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm text-gray-400">
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        <span className="text-gray-200">·</span>
                        <span className="text-sm text-gray-400">{post.readTime}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
                    <p className="text-gray-500 text-lg leading-relaxed">{post.excerpt}</p>
                    <div className="flex gap-2 flex-wrap mt-4">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>

                <hr className="border-gray-100 mb-10" />

                {/* Content */}
                <article className="prose prose-gray prose-lg max-w-none
                        prose-headings:font-semibold prose-headings:text-gray-900
                        prose-p:text-gray-600 prose-p:leading-relaxed
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:text-gray-500
                        prose-strong:text-gray-900
                        prose-li:text-gray-600">
                    <PostContent html={htmlContent} />
                </article>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-100">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        ← Back to all posts
                    </Link>
                </div>
            </div>
        </main>
    )
}
