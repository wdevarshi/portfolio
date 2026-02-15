'use client'

import React, {useState} from 'react';
import {Wand2, Copy, Trash2, Minimize2, Check} from 'lucide-react';

export default function JsonParser() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const formatJson = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setInput(formatted);
            setOutput(formatted);
            setError('');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Invalid JSON');
            }
        }
    };

    const minifyJson = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setInput(minified);
            setOutput(minified);
            setError('');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Invalid JSON');
            }
        }
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    const handleCopy = async () => {
        const text = output || input;
        if (!text.trim()) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const content = e.target.value;
        setInput(content);

        if (!content.trim()) {
            setError('');
            setOutput('');
            return;
        }

        try {
            if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
                JSON.parse(content);
                setError('');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Invalid JSON');
            }
        }
    };

    const parseAndHighlight = (code: string) => {
        if (!code) return '';

        try {
            if (code.trim().startsWith('{') || code.trim().startsWith('[')) {
                const parsed = JSON.parse(code);
                code = JSON.stringify(parsed, null, 2);
            }
        } catch {
            return code;
        }

        return code.split('\n').map((line) => {
            const highlightedLine = line.replace(
                /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
                (match) => {
                    let className = 'text-gray-800';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            className = 'text-[var(--json-property)]';
                        } else {
                            className = 'text-[var(--json-string)]';
                        }
                    } else if (/true|false/.test(match)) {
                        className = 'text-[var(--json-boolean)]';
                    } else if (/null/.test(match)) {
                        className = 'text-[var(--json-null)]';
                    } else if (/^-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?$/.test(match)) {
                        className = 'text-[var(--json-number)]';
                    }
                    return `<span class="${className}">${match}</span>`;
                }
            );
            return `<div>${highlightedLine}</div>`;
        }).join('');
    };

    const placeholder = `{
  "name": "example",
  "version": 1,
  "tags": ["json", "parser"]
}`;

    return (
        <div className="w-full mx-auto json-viewer">
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <button
                    onClick={formatJson}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
                >
                    <Wand2 size={14} />
                    Format
                </button>
                <button
                    onClick={minifyJson}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
                >
                    <Minimize2 size={14} />
                    Minify
                </button>
                <button
                    onClick={handleClear}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                    <Trash2 size={14} />
                    Clear
                </button>
                <div className="flex-1" />
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                    {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                    {copySuccess ? 'Copied' : 'Copy'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={handleInput}
                        placeholder={placeholder}
                        className={`w-full h-[calc(100vh-240px)] p-4 bg-gray-50 rounded-lg font-mono text-sm leading-relaxed
                                   focus:ring-2 focus:ring-gray-200 focus:outline-none resize-none
                                   border ${error ? 'border-red-300' : 'border-gray-200'}`}
                        style={{
                            fontFamily: 'MonoLisa, monospace',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            tabSize: 2,
                        }}
                    />
                    {error && (
                        <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 bg-red-50 border border-red-200 rounded text-xs text-red-600 truncate">
                            {error}
                        </div>
                    )}
                </div>

                <div>
                    <pre
                        className="w-full h-[calc(100vh-240px)] p-4 bg-gray-50 rounded-lg overflow-auto border border-gray-200
                                   font-mono text-sm leading-relaxed"
                        style={{
                            fontFamily: 'MonoLisa, monospace',
                            fontSize: '14px',
                            lineHeight: '1.6',
                        }}
                        dangerouslySetInnerHTML={{__html: parseAndHighlight(output || input)}}
                    />
                </div>
            </div>
        </div>
    );
}
