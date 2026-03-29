import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { getAllPosts } from '../../lib/posts'

export const metadata = {
    title: 'Blog — Devarshi Waghela',
    description: 'Technical writing on AI, engineering, and building products.',
}

export default function BlogPage() {
    const posts = getAllPosts()

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Writing</h1>
                    <p className="text-gray-500 text-base">
                        Technical deep-dives on AI, engineering, and building things.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <p className="text-gray-400">No posts yet.</p>
                ) : (
                    <div className="space-y-8">
                        {posts.map((post) => (
                            <article key={post.slug} className="group">
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
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
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
