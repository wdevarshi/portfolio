'use client';

import React, { useState } from 'react';
import Papa, { ParseError, ParseResult, ParseConfig } from 'papaparse';
import { Wand2 } from 'lucide-react';

export default function CSVtoJSON() {
    const [csvInput, setCSVInput] = useState<string>('');
    const [jsonResult, setJsonResult] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleConvert = () => {
        if (!csvInput.trim()) {
            setError('Please enter some CSV data');
            return;
        }

        try {
            const config: ParseConfig = {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: (results: ParseResult<unknown>) => {
                    if (results.errors.length > 0) {
                        setError(results.errors[0].message);
                    } else {
                        setJsonResult(JSON.stringify(results.data, null, 2));
                        setError('');
                    }
                },
            };

            Papa.parse(csvInput as string, config);
        } catch (err) {
            if (err instanceof Error) {
                setError('Failed to convert: ' + err.message);
            } else {
                setError('An unknown error occurred');
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
        } catch (e) {
            console.error('JSON parsing error:', e);
            return code;
        }

        return code.split('\n').map((line, i) => {
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

    return (
        <div className="w-[100%] mx-auto json-viewer">
            <div className="mb-6 flex gap-4">
                <button
                    onClick={handleConvert}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    <Wand2 size={16} />
                    Convert to JSON
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[800px]">
                    <textarea
                        value={csvInput}
                        onChange={(e) => setCSVInput(e.target.value)}
                        placeholder="Paste your CSV data here..."
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
                        dangerouslySetInnerHTML={{ __html: parseAndHighlight(jsonResult) }}
                    />
                </div>
            </div>
        </div>
    );
}