'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check, Trash2, ArrowRightLeft } from 'lucide-react';

export default function Base64Tool() {
  const [textInput, setTextInput] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedSide, setCopiedSide] = useState<'text' | 'base64' | null>(null);

  const handleTextChange = useCallback((value: string) => {
    setTextInput(value);
    setError(null);
    try {
      setBase64Input(btoa(unescape(encodeURIComponent(value))));
    } catch {
      setBase64Input('');
      if (value) setError('Failed to encode');
    }
  }, []);

  const handleBase64Change = useCallback((value: string) => {
    setBase64Input(value);
    setError(null);
    try {
      setTextInput(decodeURIComponent(escape(atob(value))));
    } catch {
      setTextInput('');
      if (value) setError('Invalid Base64 input');
    }
  }, []);

  const handleCopy = async (side: 'text' | 'base64') => {
    const content = side === 'text' ? textInput : base64Input;
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSide(side);
      setTimeout(() => setCopiedSide(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClear = () => {
    setTextInput('');
    setBase64Input('');
    setError(null);
  };

  const handleSwap = () => {
    const oldText = textInput;
    const oldBase64 = base64Input;
    setTextInput(oldBase64);
    setError(null);
    try {
      setBase64Input(btoa(unescape(encodeURIComponent(oldBase64))));
    } catch {
      setBase64Input(oldText);
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Controls */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <button
          onClick={handleSwap}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
        >
          <ArrowRightLeft size={14} />
          Swap
        </button>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Side-by-side panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text side */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-500">Text</label>
            <button
              onClick={() => handleCopy('text')}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              {copiedSide === 'text' ? (
                <Check size={12} />
              ) : (
                <Copy size={12} />
              )}
              {copiedSide === 'text' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Type or paste text here..."
            className="w-full p-3 text-sm font-mono bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:outline-none resize-none"
            rows={12}
            spellCheck={false}
          />
        </div>

        {/* Base64 side */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-500">Base64</label>
            <button
              onClick={() => handleCopy('base64')}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              {copiedSide === 'base64' ? (
                <Check size={12} />
              ) : (
                <Copy size={12} />
              )}
              {copiedSide === 'base64' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={base64Input}
            onChange={(e) => handleBase64Change(e.target.value)}
            placeholder="Type or paste Base64 here..."
            className="w-full p-3 text-sm font-mono bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:outline-none resize-none"
            rows={12}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>{textInput.length} characters</span>
        <span>{base64Input.length} characters (Base64)</span>
      </div>
    </div>
  );
}
