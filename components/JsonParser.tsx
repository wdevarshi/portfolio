'use client'

import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';

export default function JsonParser() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const formatJson = () => {
        try {
            const parsedJson = JSON.parse(input);
            const formattedJson = JSON.stringify(parsedJson, null, 2);
            setInput(formattedJson);
            setOutput(formattedJson);
            setError('');
        } catch (err) {
            console.error('JSON parsing error:', err);
            setError('Invalid JSON');
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const content = e.target.value;
        setInput(content);

        if (!content.trim()) {
            setError('');
            return;
        }

        try {
            // Only try to parse if it looks like JSON
            if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
                JSON.parse(content);
                setError('');
            }
        } catch (err) {
            console.error('JSON parsing error:', err);
            setError('Invalid JSON');
        }
    };

    const parseAndHighlight = (code: string) => {
        if (!code) return '';

        try {
            // Only try to parse if it looks like JSON
            if (code.trim().startsWith('{') || code.trim().startsWith('[')) {
                const parsed = JSON.parse(code);
                code = JSON.stringify(parsed, null, 2);
            }
        } catch (e) {
            // If invalid JSON, just use the raw string
            console.error('JSON parsing error:', e);
            return code;
        }

        return code.split('\n').map((line, i) => {
            console.log(i);
            const highlightedLine = line.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
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
                });
            return `<div>${highlightedLine}</div>`;
        }).join('');
    };

    return (
        <div className="w-[100%] mx-auto p-6 json-viewer">
            <div className="mb-6 flex gap-4">
                <button
                    onClick={formatJson}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    <Wand2 size={16} />
                    Format
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[800px]">
          <textarea
              value={input}
              onChange={handleInput}
              placeholder="Paste your JSON here..."
              className="w-full h-full p-6 bg-gray-50 rounded-lg font-mono text-sm leading-relaxed
                     focus:ring-2 focus:ring-gray-200 focus:outline-none resize-none
                     border border-gray-200"
              style={{
                  fontFamily: 'MonoLisa, monospace',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  tabSize: 2
              }}
          />
                    <div className="mt-2 h-6 text-sm">
                        {error && <span className="text-red-500">{error}</span>}
                    </div>
                </div>

                <div className="h-[800px]">
          <pre
              className="w-full h-full p-6 bg-gray-50 rounded-lg overflow-auto border border-gray-200
                     font-mono text-sm leading-relaxed"
              style={{
                  fontFamily: 'MonoLisa, monospace',
                  fontSize: '14px',
                  lineHeight: '1.6'
              }}
              dangerouslySetInnerHTML={{ __html: parseAndHighlight(output || input) }}
          />
                </div>
            </div>
        </div>
    );
}