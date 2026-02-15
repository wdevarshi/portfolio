'use client';

import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {Copy, Check, RefreshCw} from 'lucide-react';

export default function UUIDGenerator() {
    const [count, setCount] = useState<number>(1);
    const [uuidList, setUuidList] = useState<string[]>([uuidv4()]);
    const [newLine, setNewLine] = useState<boolean>(true);
    const [quoteType, setQuoteType] = useState<string>('none');
    const [includeComma, setIncludeComma] = useState<boolean>(false);
    const [copiedAll, setCopiedAll] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const generateUUIDs = () => {
        const list = Array.from({length: count}, () => uuidv4());
        setUuidList(list);
    };

    const formatUUID = (uuid: string) => {
        if (quoteType === 'single') return `'${uuid}'`;
        if (quoteType === 'double') return `"${uuid}"`;
        return uuid;
    };

    const getFormattedOutput = () => {
        const formatted = uuidList.map(formatUUID);
        return formatted.join(newLine ? (includeComma ? ',\n' : '\n') : ', ');
    };

    React.useEffect(() => {
        generateUUIDs();
    }, [count]);

    const handleCopyAll = async () => {
        try {
            await navigator.clipboard.writeText(getFormattedOutput());
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleCopySingle = async (uuid: string, index: number) => {
        try {
            await navigator.clipboard.writeText(formatUUID(uuid));
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="w-full mx-auto">
            {/* Options */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Count</label>
                        <input
                            type="number"
                            value={count}
                            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
                            className="w-full p-2 text-sm bg-white rounded-md border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                            min="1"
                            max="100"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Quotes</label>
                        <select
                            value={quoteType}
                            onChange={(e) => setQuoteType(e.target.value)}
                            className="w-full p-2 text-sm bg-white rounded-md border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                        >
                            <option value="none">None</option>
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={newLine}
                                onChange={(e) => setNewLine(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            New lines
                        </label>
                    </div>
                    {newLine && (
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeComma}
                                    onChange={(e) => setIncludeComma(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                Commas
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Generate button */}
            <button
                onClick={generateUUIDs}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors mb-6"
            >
                <RefreshCw size={16} />
                Generate UUIDs
            </button>

            {/* Output */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-500">
                        {uuidList.length} UUID{uuidList.length !== 1 ? 's' : ''} generated
                    </label>
                    <button
                        onClick={handleCopyAll}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        {copiedAll ? <Check size={12} /> : <Copy size={12} />}
                        {copiedAll ? 'Copied' : 'Copy all'}
                    </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
                    {uuidList.map((uuid, i) => (
                        <button
                            key={`${uuid}-${i}`}
                            onClick={() => handleCopySingle(uuid, i)}
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-white hover:bg-gray-50 transition-colors text-left group"
                        >
                            <span
                                className="font-mono text-sm text-gray-800"
                                style={{fontFamily: 'MonoLisa, monospace'}}
                            >
                                {formatUUID(uuid)}
                            </span>
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 flex-shrink-0 ml-4">
                                {copiedIndex === i ? (
                                    <><Check size={12} /> copied</>
                                ) : (
                                    <><Copy size={12} /> click to copy</>
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
