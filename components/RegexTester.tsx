'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Copy, Check, Zap } from 'lucide-react'

interface MatchGroup {
  matchIndex: number
  fullMatch: string
  groups: { name: string; value: string }[]
  index: number
}

const COMMON_PATTERNS: { label: string; pattern: string; flags: string }[] = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { label: 'URL', pattern: 'https?:\\/\\/[\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]+', flags: 'g' },
  { label: 'Phone', pattern: '\\+?\\d{1,4}[\\s.-]?\\(?\\d{1,4}\\)?[\\s.-]?\\d{1,4}[\\s.-]?\\d{1,9}', flags: 'g' },
  { label: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
  { label: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'g' },
  { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g' },
]

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [testString, setTestString] = useState('')
  const [flagG, setFlagG] = useState(true)
  const [flagI, setFlagI] = useState(false)
  const [flagM, setFlagM] = useState(false)
  const [flagS, setFlagS] = useState(false)
  const [copiedPattern, setCopiedPattern] = useState(false)

  const flags = useMemo(() => {
    let f = ''
    if (flagG) f += 'g'
    if (flagI) f += 'i'
    if (flagM) f += 'm'
    if (flagS) f += 's'
    return f
  }, [flagG, flagI, flagM, flagS])

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: '' }
    try {
      const r = new RegExp(pattern, flags)
      return { regex: r, error: '' }
    } catch (e) {
      return { regex: null, error: e instanceof Error ? e.message : 'Invalid regex' }
    }
  }, [pattern, flags])

  const matches = useMemo((): MatchGroup[] => {
    if (!regex || !testString) return []
    const results: MatchGroup[] = []
    // Ensure we don't infinite-loop on zero-length matches
    const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g')
    let match: RegExpExecArray | null
    let safety = 0
    while ((match = re.exec(testString)) !== null && safety < 10000) {
      safety++
      const groups: { name: string; value: string }[] = []
      // Numbered groups
      for (let i = 1; i < match.length; i++) {
        groups.push({ name: `Group ${i}`, value: match[i] ?? '' })
      }
      // Named groups
      if (match.groups) {
        for (const [name, value] of Object.entries(match.groups)) {
          groups.push({ name, value: value ?? '' })
        }
      }
      results.push({
        matchIndex: results.length,
        fullMatch: match[0],
        groups,
        index: match.index,
      })
      if (match[0].length === 0) re.lastIndex++
      if (!regex.flags.includes('g')) break
    }
    return results
  }, [regex, testString])

  const highlightedHtml = useMemo(() => {
    if (!regex || !testString || matches.length === 0) return null
    const parts: { text: string; isMatch: boolean }[] = []
    let lastIndex = 0
    for (const m of matches) {
      if (m.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false })
      }
      parts.push({ text: m.fullMatch, isMatch: true })
      lastIndex = m.index + m.fullMatch.length
    }
    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false })
    }
    return parts
  }, [regex, testString, matches])

  const applyPreset = useCallback((preset: typeof COMMON_PATTERNS[0]) => {
    setPattern(preset.pattern)
    setFlagG(preset.flags.includes('g'))
    setFlagI(preset.flags.includes('i'))
    setFlagM(preset.flags.includes('m'))
    setFlagS(preset.flags.includes('s'))
  }, [])

  const copyPattern = useCallback(() => {
    const full = `/${pattern}/${flags}`
    navigator.clipboard.writeText(full)
    setCopiedPattern(true)
    setTimeout(() => setCopiedPattern(false), 1500)
  }, [pattern, flags])

  return (
    <div className="space-y-6">
      {/* Quick Insert */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Common Patterns</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_PATTERNS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Zap className="w-3 h-3" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Regular Expression
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-gray-400 focus-within:border-gray-400">
            <span className="pl-3 text-gray-400 font-mono text-sm select-none">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="flex-1 px-1 py-2 font-mono text-sm bg-transparent outline-none text-gray-900"
              spellCheck={false}
            />
            <span className="pr-3 text-gray-400 font-mono text-sm select-none">/{flags}</span>
          </div>
          <button
            onClick={copyPattern}
            disabled={!pattern}
            className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            title="Copy regex"
          >
            {copiedPattern ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-4">
        {[
          { flag: 'g', label: 'Global', state: flagG, setter: setFlagG },
          { flag: 'i', label: 'Case Insensitive', state: flagI, setter: setFlagI },
          { flag: 'm', label: 'Multiline', state: flagM, setter: setFlagM },
          { flag: 's', label: 'Dotall', state: flagS, setter: setFlagS },
        ].map(({ flag, label, state, setter }) => (
          <label key={flag} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={state}
              onChange={(e) => setter(e.target.checked)}
              className="rounded border-gray-300 text-gray-900 focus:ring-gray-400"
            />
            <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{flag}</span>
            {label}
          </label>
        ))}
      </div>

      {/* Test String */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Test String</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter test string..."
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none resize-y"
          spellCheck={false}
        />
      </div>

      {/* Match Highlight */}
      {highlightedHtml && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Matches</label>
            <span className="text-sm text-gray-500">
              {matches.length} match{matches.length !== 1 ? 'es' : ''} found
            </span>
          </div>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm bg-white text-gray-900 whitespace-pre-wrap break-all">
            {highlightedHtml.map((part, i) =>
              part.isMatch ? (
                <mark
                  key={i}
                  className="bg-yellow-200 text-gray-900 rounded-sm px-0.5"
                >
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </div>
        </div>
      )}

      {/* No matches message */}
      {regex && testString && matches.length === 0 && (
        <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
          No matches found
        </div>
      )}

      {/* Match Groups Table */}
      {matches.length > 0 && matches.some((m) => m.groups.length > 0) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Match Groups</label>
          <div className="overflow-x-auto border border-gray-300 rounded-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="text-left px-3 py-2 font-medium text-gray-700">#</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-700">Full Match</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-700">Group</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-700">Value</th>
                </tr>
              </thead>
              <tbody>
                {matches
                  .filter((m) => m.groups.length > 0)
                  .flatMap((m) =>
                    m.groups.map((g, gi) => (
                      <tr key={`${m.matchIndex}-${gi}`} className="border-b border-gray-200 last:border-0">
                        {gi === 0 && (
                          <>
                            <td className="px-3 py-2 font-mono text-gray-500" rowSpan={m.groups.length}>
                              {m.matchIndex + 1}
                            </td>
                            <td className="px-3 py-2 font-mono text-gray-900" rowSpan={m.groups.length}>
                              {m.fullMatch}
                            </td>
                          </>
                        )}
                        <td className="px-3 py-2 font-mono text-gray-600">{g.name}</td>
                        <td className="px-3 py-2 font-mono text-gray-900">{g.value}</td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All matches list (when no groups) */}
      {matches.length > 0 && matches.every((m) => m.groups.length === 0) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">All Matches</label>
          <div className="overflow-x-auto border border-gray-300 rounded-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="text-left px-3 py-2 font-medium text-gray-700">#</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-700">Match</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-700">Index</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.matchIndex} className="border-b border-gray-200 last:border-0">
                    <td className="px-3 py-2 font-mono text-gray-500">{m.matchIndex + 1}</td>
                    <td className="px-3 py-2 font-mono text-gray-900">{m.fullMatch}</td>
                    <td className="px-3 py-2 font-mono text-gray-500">{m.index}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
