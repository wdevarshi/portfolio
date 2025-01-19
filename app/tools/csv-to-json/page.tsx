'use client';
import React, { useState } from 'react';
import Papa from 'papaparse';

const CSVtoJSONConverter = () => {
    const [csvInput, setCsvInput] = useState('');
    const [jsonResult, setJsonResult] = useState('');
    const [error, setError] = useState('');

    const handleConvert = () => {
        if (!csvInput.trim()) {
            setError('Please enter CSV data');
            setJsonResult('');
            return;
        }

        try {
            Papa.parse(csvInput, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        setError('Error parsing CSV: ' + results.errors[0].message);
                        setJsonResult('');
                    } else {
                        setJsonResult(JSON.stringify(results.data, null, 2));
                        setError('');
                    }
                },
                error: (error) => {
                    setError('Error parsing CSV: ' + error.message);
                    setJsonResult('');
                }
            });
        } catch (error) {
            setError('Error parsing CSV: ' + error.message);
            setJsonResult('');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(jsonResult);
    };

    const clearAll = () => {
        setCsvInput('');
        setJsonResult('');
        setError('');
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">CSV to JSON Converter</h2>

            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Paste CSV Data
                    </label>
                    {csvInput && (
                        <button
                            onClick={clearAll}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Clear All
                        </button>
                    )}
                </div>
                <textarea
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    placeholder="Paste your CSV data here..."
                    className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="mb-6">
                <button
                    onClick={handleConvert}
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                >
                    Convert to JSON
                </button>
            </div>

            {error && (
                <div className="mb-4 text-red-500">
                    {error}
                </div>
            )}

            {jsonResult && (
                <div className="mb-4">
                    <div className="flex justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            JSON Output
                        </label>
                        <button
                            onClick={copyToClipboard}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Copy to Clipboard
                        </button>
                    </div>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-sm">
            {jsonResult}
          </pre>
                </div>
            )}
        </div>
    );
};

export default CSVtoJSONConverter;