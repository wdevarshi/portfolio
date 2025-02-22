'use client';

import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {Copy} from 'lucide-react';

export default function UUIDGenerator() {
    const [count, setCount] = useState<number>(1);
    const [uuids, setUUIDs] = useState<string>(uuidv4());
    const [copySuccess, setCopySuccess] = useState(false);
    const [newLine, setNewLine] = useState<boolean>(true);
    const [quoteType, setQuoteType] = useState<string>('none');
    const [includeComma, setIncludeComma] = useState<boolean>(false);

    // Move UUID generation to a separate function
    const generateUUIDString = () => {
        return Array.from({length: count}, () => {
            let uuid = uuidv4();
            if (quoteType === 'single') {
                uuid = `'${uuid}'`;
            } else if (quoteType === 'double') {
                uuid = `"${uuid}"`;
            }
            return uuid;
        }).join(newLine ? (includeComma ? ',\n' : '\n') : ', ');
    };

    // Use useEffect to update UUIDs whenever options change
    React.useEffect(() => {
        setUUIDs(generateUUIDString());
    }, [count, newLine, quoteType, includeComma]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(uuids);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <div className="w-[100%] mx-auto json-viewer">
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Number of UUIDs</label>
                    <input
                        type="number"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-20 p-2 bg-gray-50 rounded-lg border border-gray-200"
                        min="1"
                    />
                </div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">New Line</label>
                    <input
                        type="checkbox"
                        checked={newLine}
                        onChange={(e) => setNewLine(e.target.checked)}
                        className="w-5 h-5"
                    />
                </div>
                {newLine && (
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Include Comma</label>
                        <input
                            type="checkbox"
                            checked={includeComma}
                            onChange={(e) => setIncludeComma(e.target.checked)}
                            className="w-5 h-5"
                        />
                    </div>
                )}
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Quote Type</label>
                    <select
                        value={quoteType}
                        onChange={(e) => setQuoteType(e.target.value)}
                        className="w-32 p-2 bg-gray-50 rounded-lg border border-gray-200"
                    >
                        <option value="none">None</option>
                        <option value="single">Single Quote</option>
                        <option value="double">Double Quote</option>
                    </select>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Generated UUIDs</label>
                    <button
                        onClick={() => setUUIDs(generateUUIDString())}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Regenerate UUIDs
                    </button>
                </div>
                <div className="flex justify-between items-center">
                    <textarea
                        value={uuids}
                        readOnly
                        className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200"
                        rows={4}
                    />
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-4 py-3 text-gray-600 hover:text-gray-900 rounded-md transition-colors"
                    >
                        <Copy size={16}/>
                        {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
            </div>
        </div>
    );
}