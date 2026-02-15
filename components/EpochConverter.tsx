'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Clock } from 'lucide-react';

const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland',
];

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiff = Math.abs(diffMs);
  const future = diffMs < 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let str: string;
  if (seconds < 60) str = `${seconds} second${seconds !== 1 ? 's' : ''}`;
  else if (minutes < 60) str = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  else if (hours < 24) str = `${hours} hour${hours !== 1 ? 's' : ''}`;
  else if (days < 30) str = `${days} day${days !== 1 ? 's' : ''}`;
  else if (months < 12) str = `${months} month${months !== 1 ? 's' : ''}`;
  else str = `${years} year${years !== 1 ? 's' : ''}`;

  return future ? `in ${str}` : `${str} ago`;
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
      className="ml-2 p-1 text-gray-400 hover:text-gray-700 transition-colors"
      title="Copy"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  );
}

export default function EpochConverter() {
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [convertedDate, setConvertedDate] = useState<Date | null>(null);
  const [convertedEpoch, setConvertedEpoch] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertFromTimestamp = useCallback(() => {
    setError('');
    setConvertedEpoch(null);
    const raw = timestampInput.trim();
    if (!raw) {
      setConvertedDate(null);
      return;
    }
    const num = Number(raw);
    if (isNaN(num)) {
      setError('Invalid timestamp');
      setConvertedDate(null);
      return;
    }
    // Auto-detect: if > 1e12 treat as milliseconds, else seconds
    const ms = num > 1e12 ? num : num * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) {
      setError('Invalid timestamp');
      setConvertedDate(null);
      return;
    }
    setConvertedDate(date);
  }, [timestampInput]);

  const convertFromDate = useCallback(() => {
    setError('');
    setConvertedDate(null);
    const raw = dateInput.trim();
    if (!raw) {
      setConvertedEpoch(null);
      return;
    }
    const date = new Date(raw);
    if (isNaN(date.getTime())) {
      setError('Invalid date format. Try: YYYY-MM-DD HH:MM:SS');
      setConvertedEpoch(null);
      return;
    }
    setConvertedEpoch(Math.floor(date.getTime() / 1000));
  }, [dateInput]);

  const formatInTimezone = (date: Date, tz: string): string => {
    try {
      return date.toLocaleString('en-US', { timeZone: tz, dateStyle: 'full', timeStyle: 'long' });
    } catch {
      return date.toLocaleString();
    }
  };

  const results = convertedDate
    ? [
        { label: 'ISO 8601', value: convertedDate.toISOString() },
        { label: 'UTC', value: convertedDate.toUTCString() },
        { label: 'Local Time', value: convertedDate.toLocaleString() },
        { label: `${timezone}`, value: formatInTimezone(convertedDate, timezone) },
        { label: 'Relative', value: getRelativeTime(convertedDate) },
        { label: 'Unix (seconds)', value: String(Math.floor(convertedDate.getTime() / 1000)) },
        { label: 'Unix (milliseconds)', value: String(convertedDate.getTime()) },
      ]
    : null;

  const epochResults = convertedEpoch !== null
    ? [
        { label: 'Unix (seconds)', value: String(convertedEpoch) },
        { label: 'Unix (milliseconds)', value: String(convertedEpoch * 1000) },
        { label: 'ISO 8601', value: new Date(convertedEpoch * 1000).toISOString() },
        { label: 'Relative', value: getRelativeTime(new Date(convertedEpoch * 1000)) },
      ]
    : null;

  return (
    <div className="space-y-8">
      {/* Live current timestamp */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Current Unix Timestamp</span>
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-mono text-gray-900">{currentEpoch}</span>
          <CopyButton text={String(currentEpoch)} />
        </div>
      </div>

      {/* Timezone selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timestamp to Date */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Timestamp to Date</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unix Timestamp (seconds or milliseconds)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && convertFromTimestamp()}
                placeholder="e.g. 1700000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                onClick={convertFromTimestamp}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
              >
                Convert
              </button>
            </div>
          </div>
          {results && (
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {results.map((r) => (
                <div key={r.label} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{r.label}</span>
                    <p className="text-sm font-mono text-gray-900 break-all">{r.value}</p>
                  </div>
                  <CopyButton text={r.value} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date to Timestamp */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Date to Timestamp</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date/Time String
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && convertFromDate()}
                placeholder="e.g. 2024-01-15 12:00:00"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                onClick={convertFromDate}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
              >
                Convert
              </button>
            </div>
          </div>
          {epochResults && (
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {epochResults.map((r) => (
                <div key={r.label} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{r.label}</span>
                    <p className="text-sm font-mono text-gray-900 break-all">{r.value}</p>
                  </div>
                  <CopyButton text={r.value} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
