import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), 'content/posts')

export interface PostMeta {
    slug: string
    title: string
    date: string
    excerpt: string
    tags: string[]
    readTime: string
}

export interface Post extends PostMeta {
    content: string
}

export function getAllPosts(): PostMeta[] {
    if (!fs.existsSync(postsDir)) return []

    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))

    const posts = files.map((filename) => {
        const slug = filename.replace('.md', '')
        const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
        const { data } = matter(raw)

        return {
            slug,
            title: data.title || '',
            date: data.date || '',
            excerpt: data.excerpt || '',
            tags: data.tags || [],
            readTime: data.readTime || '5 min read',
        }
    })

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): Post | null {
    const filePath = path.join(postsDir, `${slug}.md`)
    if (!fs.existsSync(filePath)) return null

    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    return {
        slug,
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        readTime: data.readTime || '5 min read',
        content,
    }
}

export function getAllSlugs(): string[] {
    if (!fs.existsSync(postsDir)) return []
    return fs
        .readdirSync(postsDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.replace('.md', ''))
}
