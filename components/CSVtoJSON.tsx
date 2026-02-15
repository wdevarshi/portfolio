'use client';

import React, {useState, useRef, useCallback} from 'react';
import Papa, {ParseResult, ParseConfig} from 'papaparse';
import {Wand2, Copy, Check, Upload} from 'lucide-react';

export default function CSVtoJSON() {
    const [csvInput, setCSVInput] = useState<string>('');
    const [jsonResult, setJsonResult] = useState<string>('');
    const [rowCount, setRowCount] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleConvert = (csv?: string) => {
        const data = csv ?? csvInput;
        if (!data.trim()) {
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
                        setRowCount(results.data.length);
                        setError('');
                    }
                },
            };

            Papa.parse(data, config);
        } catch (err) {
            if (err instanceof Error) {
                setError('Failed to convert: ' + err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    const handleCopy = async () => {
        if (!jsonResult) return;
        try {
            await navigator.clipboard.writeText(jsonResult);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const readFile = useCallback((file: File) => {
        if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
            setError('Please upload a .csv file');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setCSVInput(text);
            setError('');
        };
        reader.readAsText(file);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) readFile(file);
    }, [readFile]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) readFile(file);
    }, [readFile]);

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

    return (
        <div className="w-full mx-auto json-viewer">
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <button
                    onClick={() => handleConvert()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
                >
                    <Wand2 size={14} />
                    Convert
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                    <Upload size={14} />
                    Upload CSV
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                {rowCount > 0 && (
                    <span className="text-xs text-gray-500 ml-auto">
                        {rowCount} row{rowCount !== 1 ? 's' : ''} converted
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input */}
                <div
                    className="relative"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">CSV Input</label>
                    <textarea
                        value={csvInput}
                        onChange={(e) => setCSVInput(e.target.value)}
                        placeholder={"name,age,city\nAlice,30,NYC\nBob,25,London"}
                        className={`w-full h-[calc(100vh-280px)] p-4 bg-gray-50 rounded-lg font-mono text-sm leading-relaxed
                                   focus:ring-2 focus:ring-gray-200 focus:outline-none resize-none
                                   border ${isDragging ? 'border-gray-400 bg-gray-100' : 'border-gray-200'}`}
                        style={{
                            fontFamily: 'MonoLisa, monospace',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            tabSize: 2,
                        }}
                    />
                    {isDragging && (
                        <div className="absolute inset-0 top-6 flex items-center justify-center bg-gray-100/80 border-2 border-dashed border-gray-400 rounded-lg pointer-events-none">
                            <p className="text-sm text-gray-600">Drop CSV file here</p>
                        </div>
                    )}
                    {error && (
                        <div className="mt-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                {/* Output */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-gray-500">JSON Output</label>
                        {jsonResult && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                {copySuccess ? <Check size={12} /> : <Copy size={12} />}
                                {copySuccess ? 'Copied' : 'Copy'}
                            </button>
                        )}
                    </div>
                    <pre
                        className="w-full h-[calc(100vh-280px)] p-4 bg-gray-50 rounded-lg overflow-auto border border-gray-200
                                   font-mono text-sm leading-relaxed"
                        style={{
                            fontFamily: 'MonoLisa, monospace',
                            fontSize: '14px',
                            lineHeight: '1.6',
                        }}
                        dangerouslySetInnerHTML={{__html: jsonResult ? parseAndHighlight(jsonResult) : '<span class="text-gray-400">JSON output will appear here</span>'}}
                    />
                </div>
            </div>
        </div>
    );
}
