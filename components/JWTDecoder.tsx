'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check, Clock, AlertCircle } from 'lucide-react';

interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return atob(base64);
}

function formatExpiry(exp: number): { label: string; expired: boolean } {
  const now = Date.now() / 1000;
  const diff = exp - now;

  if (diff <= 0) {
    const ago = Math.abs(diff);
    if (ago < 60) return { label: `Expired ${Math.floor(ago)}s ago`, expired: true };
    if (ago < 3600) return { label: `Expired ${Math.floor(ago / 60)}m ago`, expired: true };
    if (ago < 86400) return { label: `Expired ${Math.floor(ago / 3600)}h ago`, expired: true };
    return { label: `Expired ${Math.floor(ago / 86400)}d ago`, expired: true };
  }

  if (diff < 60) return { label: `Valid for ${Math.floor(diff)}s`, expired: false };
  if (diff < 3600) return { label: `Valid for ${Math.floor(diff / 60)}m`, expired: false };
  if (diff < 86400) return { label: `Valid for ${Math.floor(diff / 3600)}h`, expired: false };
  return { label: `Valid for ${Math.floor(diff / 86400)}d`, expired: false };
}

export default function JWTDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const decode = useCallback((input: string) => {
    setToken(input);
    setError(null);
    setDecoded(null);

    const trimmed = input.trim();
    if (!trimmed) return;

    const parts = trimmed.split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT: expected 3 parts separated by dots');
      return;
    }

    try {
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));
      const signature = parts[2];
      setDecoded({ header, payload, signature });
    } catch {
      setError('Failed to decode JWT: invalid base64 or JSON');
    }
  }, []);

  const handleCopy = async (section: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const expiry = decoded?.payload?.exp
    ? formatExpiry(decoded.payload.exp as number)
    : null;

  const expiryDate = decoded?.payload?.exp
    ? new Date((decoded.payload.exp as number) * 1000).toLocaleString()
    : null;

  return (
    <div className="w-full mx-auto">
      {/* Input */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Paste JWT Token
        </label>
        <textarea
          value={token}
          onChange={(e) => decode(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
          className="w-full p-3 text-sm font-mono bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:outline-none resize-none"
          rows={4}
          spellCheck={false}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Decoded output */}
      {decoded && (
        <div className="space-y-4">
          {/* Expiry indicator */}
          {expiry && (
            <div
              className={`p-3 rounded-lg border flex items-center gap-2 text-sm ${
                expiry.expired
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}
            >
              <Clock size={16} className="flex-shrink-0" />
              <span className="font-medium">{expiry.label}</span>
              <span className="text-xs opacity-70 ml-auto">{expiryDate}</span>
            </div>
          )}

          {/* Header */}
          <Section
            title="Header"
            color="blue"
            content={decoded.header}
            copied={copiedSection === 'header'}
            onCopy={() =>
              handleCopy('header', JSON.stringify(decoded.header, null, 2))
            }
          />

          {/* Payload */}
          <Section
            title="Payload"
            color="purple"
            content={decoded.payload}
            copied={copiedSection === 'payload'}
            onCopy={() =>
              handleCopy('payload', JSON.stringify(decoded.payload, null, 2))
            }
          />

          {/* Signature */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-orange-600">
                Signature
              </label>
              <button
                onClick={() => handleCopy('signature', decoded.signature)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                {copiedSection === 'signature' ? (
                  <Check size={12} />
                ) : (
                  <Copy size={12} />
                )}
                {copiedSection === 'signature' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <code className="text-sm font-mono text-gray-800 break-all">
                {decoded.signature}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  color,
  content,
  copied,
  onCopy,
}: {
  title: string;
  color: 'blue' | 'purple';
  content: Record<string, unknown>;
  copied: boolean;
  onCopy: () => void;
}) {
  const colorMap = {
    blue: {
      label: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    purple: {
      label: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
    },
  };
  const c = colorMap[color];

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={`text-xs font-medium ${c.label}`}>{title}</label>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className={`p-3 ${c.bg} border ${c.border} rounded-lg overflow-x-auto`}>
        <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    </div>
  );
}
