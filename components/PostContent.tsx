'use client'

import { useEffect, useRef } from 'react'
import hljs from 'highlight.js'

interface Props {
    html: string
}

export default function PostContent({ html }: Props) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!ref.current) return

        ref.current.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block as HTMLElement)

            const pre = block.parentElement
            if (!pre || pre.querySelector('.copy-btn')) return

            // Copy button
            const btn = document.createElement('button')
            btn.className = 'copy-btn'
            btn.textContent = 'Copy'
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent || '').then(() => {
                    btn.textContent = 'Copied!'
                    setTimeout(() => (btn.textContent = 'Copy'), 2000)
                })
            })
            pre.style.position = 'relative'
            pre.appendChild(btn)
        })
    }, [html])

    return (
        <>
            <style>{`
                /* Highlight.js GitHub Dark theme */
                pre {
                    background: #0d1117 !important;
                    border-radius: 10px !important;
                    padding: 1.25rem 1.5rem !important;
                    overflow-x: auto;
                    margin: 1.75rem 0 !important;
                }
                pre code {
                    background: transparent !important;
                    padding: 0 !important;
                    border-radius: 0 !important;
                    font-size: 0.85rem !important;
                    font-family: 'Geist Mono', 'Fira Code', 'Cascadia Code', monospace !important;
                    line-height: 1.65 !important;
                    color: #e6edf3;
                }
                /* hljs tokens */
                .hljs-keyword { color: #ff7b72; }
                .hljs-built_in { color: #ffa657; }
                .hljs-type { color: #79c0ff; }
                .hljs-literal { color: #79c0ff; }
                .hljs-number { color: #79c0ff; }
                .hljs-string { color: #a5d6ff; }
                .hljs-subst { color: #e6edf3; }
                .hljs-symbol { color: #79c0ff; }
                .hljs-class { color: #ffa657; }
                .hljs-function { color: #d2a8ff; }
                .hljs-title { color: #d2a8ff; }
                .hljs-title.class_ { color: #ffa657; }
                .hljs-title.function_ { color: #d2a8ff; }
                .hljs-params { color: #e6edf3; }
                .hljs-comment { color: #8b949e; font-style: italic; }
                .hljs-meta { color: #79c0ff; }
                .hljs-attr { color: #79c0ff; }
                .hljs-variable { color: #ffa657; }
                .hljs-property { color: #79c0ff; }
                .hljs-template-variable { color: #ffa657; }
                .hljs-punctuation { color: #e6edf3; }
                .hljs-operator { color: #ff7b72; }
                .hljs-tag { color: #7ee787; }
                .hljs-name { color: #7ee787; }
                .hljs-selector-id { color: #ffa657; }
                .hljs-selector-class { color: #ffa657; }
                .hljs-regexp { color: #a5d6ff; }
                .hljs-link { color: #a5d6ff; }
                .hljs-addition { color: #aff5b4; background: #033a16; }
                .hljs-deletion { color: #ffdcd7; background: #67060c; }

                /* Copy button */
                .copy-btn {
                    position: absolute;
                    top: 0.65rem;
                    right: 0.75rem;
                    font-size: 0.7rem;
                    font-family: inherit;
                    color: #8b949e;
                    background: transparent;
                    border: 1px solid #30363d;
                    border-radius: 5px;
                    padding: 2px 8px;
                    cursor: pointer;
                    transition: color 0.15s, border-color 0.15s;
                    line-height: 1.6;
                }
                .copy-btn:hover {
                    color: #e6edf3;
                    border-color: #6e7681;
                }

                /* Inline code */
                article p code,
                article li code {
                    background: #f3f4f6 !important;
                    color: #374151 !important;
                    padding: 1px 6px !important;
                    border-radius: 4px !important;
                    font-size: 0.85em !important;
                    font-family: 'Geist Mono', monospace !important;
                }
            `}</style>
            <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
        </>
    )
}
