'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

// Pure JS MD5 implementation
function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function binlMD5(x: number[], len: number): number[] {
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      const olda = a, oldb = b, oldc = c, oldd = d;
      a = md5ff(a, b, c, d, x[i]||0, 7, -680876936);     d = md5ff(d, a, b, c, x[i+1]||0, 12, -389564586);
      c = md5ff(c, d, a, b, x[i+2]||0, 17, 606105819);    b = md5ff(b, c, d, a, x[i+3]||0, 22, -1044525330);
      a = md5ff(a, b, c, d, x[i+4]||0, 7, -176418897);    d = md5ff(d, a, b, c, x[i+5]||0, 12, 1200080426);
      c = md5ff(c, d, a, b, x[i+6]||0, 17, -1473231341);  b = md5ff(b, c, d, a, x[i+7]||0, 22, -45705983);
      a = md5ff(a, b, c, d, x[i+8]||0, 7, 1770035416);    d = md5ff(d, a, b, c, x[i+9]||0, 12, -1958414417);
      c = md5ff(c, d, a, b, x[i+10]||0, 17, -42063);      b = md5ff(b, c, d, a, x[i+11]||0, 22, -1990404162);
      a = md5ff(a, b, c, d, x[i+12]||0, 7, 1804603682);   d = md5ff(d, a, b, c, x[i+13]||0, 12, -40341101);
      c = md5ff(c, d, a, b, x[i+14]||0, 17, -1502002290); b = md5ff(b, c, d, a, x[i+15]||0, 22, 1236535329);
      a = md5gg(a, b, c, d, x[i+1]||0, 5, -165796510);    d = md5gg(d, a, b, c, x[i+6]||0, 9, -1069501632);
      c = md5gg(c, d, a, b, x[i+11]||0, 14, 643717713);   b = md5gg(b, c, d, a, x[i]||0, 20, -373897302);
      a = md5gg(a, b, c, d, x[i+5]||0, 5, -701558691);    d = md5gg(d, a, b, c, x[i+10]||0, 9, 38016083);
      c = md5gg(c, d, a, b, x[i+15]||0, 14, -660478335);  b = md5gg(b, c, d, a, x[i+4]||0, 20, -405537848);
      a = md5gg(a, b, c, d, x[i+9]||0, 5, 568446438);     d = md5gg(d, a, b, c, x[i+14]||0, 9, -1019803690);
      c = md5gg(c, d, a, b, x[i+3]||0, 14, -187363961);   b = md5gg(b, c, d, a, x[i+8]||0, 20, 1163531501);
      a = md5gg(a, b, c, d, x[i+13]||0, 5, -1444681467);  d = md5gg(d, a, b, c, x[i+2]||0, 9, -51403784);
      c = md5gg(c, d, a, b, x[i+7]||0, 14, 1735328473);   b = md5gg(b, c, d, a, x[i+12]||0, 20, -1926607734);
      a = md5hh(a, b, c, d, x[i+5]||0, 4, -378558);       d = md5hh(d, a, b, c, x[i+8]||0, 11, -2022574463);
      c = md5hh(c, d, a, b, x[i+11]||0, 16, 1839030562);  b = md5hh(b, c, d, a, x[i+14]||0, 23, -35309556);
      a = md5hh(a, b, c, d, x[i+1]||0, 4, -1530992060);   d = md5hh(d, a, b, c, x[i+4]||0, 11, 1272893353);
      c = md5hh(c, d, a, b, x[i+7]||0, 16, -155497632);   b = md5hh(b, c, d, a, x[i+10]||0, 23, -1094730640);
      a = md5hh(a, b, c, d, x[i+13]||0, 4, 681279174);    d = md5hh(d, a, b, c, x[i]||0, 11, -358537222);
      c = md5hh(c, d, a, b, x[i+3]||0, 16, -722521979);   b = md5hh(b, c, d, a, x[i+6]||0, 23, 76029189);
      a = md5hh(a, b, c, d, x[i+9]||0, 4, -640364487);    d = md5hh(d, a, b, c, x[i+12]||0, 11, -421815835);
      c = md5hh(c, d, a, b, x[i+15]||0, 16, 530742520);   b = md5hh(b, c, d, a, x[i+2]||0, 23, -995338651);
      a = md5ii(a, b, c, d, x[i]||0, 6, -198630844);      d = md5ii(d, a, b, c, x[i+7]||0, 10, 1126891415);
      c = md5ii(c, d, a, b, x[i+14]||0, 15, -1416354905); b = md5ii(b, c, d, a, x[i+5]||0, 21, -57434055);
      a = md5ii(a, b, c, d, x[i+12]||0, 6, 1700485571);   d = md5ii(d, a, b, c, x[i+3]||0, 10, -1894986606);
      c = md5ii(c, d, a, b, x[i+10]||0, 15, -1051523);    b = md5ii(b, c, d, a, x[i+1]||0, 21, -2054922799);
      a = md5ii(a, b, c, d, x[i+8]||0, 6, 1873313359);    d = md5ii(d, a, b, c, x[i+15]||0, 10, -30611744);
      c = md5ii(c, d, a, b, x[i+6]||0, 15, -1560198380);  b = md5ii(b, c, d, a, x[i+13]||0, 21, 1309151649);
      a = md5ii(a, b, c, d, x[i+4]||0, 6, -145523070);    d = md5ii(d, a, b, c, x[i+11]||0, 10, -1120210379);
      c = md5ii(c, d, a, b, x[i+2]||0, 15, 718787259);    b = md5ii(b, c, d, a, x[i+9]||0, 21, -343485551);
      a = safeAdd(a, olda); b = safeAdd(b, oldb); c = safeAdd(c, oldc); d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }

  function rstrMD5(s: string): string {
    const bytes: number[] = [];
    for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i));
    const bin: number[] = [];
    for (let i = 0; i < bytes.length * 8; i += 8) {
      bin[i >> 5] |= (bytes[i / 8] & 0xff) << (i % 32);
    }
    const hash = binlMD5(bin, bytes.length * 8);
    let hex = '';
    const hexChars = '0123456789abcdef';
    for (let i = 0; i < hash.length * 4; i++) {
      hex += hexChars.charAt((hash[i >> 2] >> ((i % 4) * 8 + 4)) & 0x0f) +
             hexChars.charAt((hash[i >> 2] >> ((i % 4) * 8)) & 0x0f);
    }
    return hex;
  }

  // Handle UTF-8 encoding
  const utf8 = unescape(encodeURIComponent(input));
  return rstrMD5(utf8);
}

async function sha(algorithm: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
      title="Copy"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  );
}

interface HashResult {
  algorithm: string;
  hash: string;
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const [computing, setComputing] = useState(false);

  const generateHashes = useCallback(async () => {
    if (!input) {
      setHashes([]);
      return;
    }
    setComputing(true);
    try {
      const [sha1, sha256, sha512] = await Promise.all([
        sha('SHA-1', input),
        sha('SHA-256', input),
        sha('SHA-512', input),
      ]);
      const md5Hash = md5(input);
      setHashes([
        { algorithm: 'MD5', hash: md5Hash },
        { algorithm: 'SHA-1', hash: sha1 },
        { algorithm: 'SHA-256', hash: sha256 },
        { algorithm: 'SHA-512', hash: sha512 },
      ]);
    } catch {
      setHashes([]);
    } finally {
      setComputing(false);
    }
  }, [input]);

  const displayHash = (hash: string) => uppercase ? hash.toUpperCase() : hash;

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={generateHashes}
          disabled={!input || computing}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {computing ? 'Computing...' : 'Generate Hashes'}
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded border-gray-300"
          />
          Uppercase
        </label>
        {input && (
          <span className="text-xs text-gray-400">{input.length} character{input.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Results */}
      {hashes.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {hashes.map((h) => (
            <div key={h.algorithm} className="flex items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{h.algorithm}</span>
                <p className="text-sm font-mono text-gray-900 break-all mt-0.5">{displayHash(h.hash)}</p>
              </div>
              <CopyButton text={displayHash(h.hash)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
