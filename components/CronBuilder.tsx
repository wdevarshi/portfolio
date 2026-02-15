'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Clock, RotateCcw } from 'lucide-react'

type FieldMode = 'every' | 'specific' | 'range' | 'step'

interface CronField {
  mode: FieldMode
  specific: string
  rangeStart: string
  rangeEnd: string
  step: string
}

const FIELD_NAMES = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week'] as const
const FIELD_RANGES: { min: number; max: number }[] = [
  { min: 0, max: 59 },
  { min: 0, max: 23 },
  { min: 1, max: 31 },
  { min: 1, max: 12 },
  { min: 0, max: 6 },
]

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const PRESETS: { label: string; cron: string }[] = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Daily at midnight', cron: '0 0 * * *' },
  { label: 'Mon at 9:00 AM', cron: '0 9 * * 1' },
  { label: 'Monthly 1st', cron: '0 0 1 * *' },
  { label: 'Weekdays at 9 AM', cron: '0 9 * * 1-5' },
]

function defaultField(): CronField {
  return { mode: 'every', specific: '', rangeStart: '', rangeEnd: '', step: '' }
}

function fieldToString(field: CronField, index: number): string {
  const range = FIELD_RANGES[index]
  switch (field.mode) {
    case 'every':
      return '*'
    case 'specific':
      return field.specific || '*'
    case 'range': {
      const start = field.rangeStart || String(range.min)
      const end = field.rangeEnd || String(range.max)
      return `${start}-${end}`
    }
    case 'step': {
      const step = field.step || '1'
      return `*/${step}`
    }
    default:
      return '*'
  }
}

function parseCronField(value: string): CronField {
  const trimmed = value.trim()
  if (trimmed === '*') {
    return defaultField()
  }
  if (trimmed.startsWith('*/')) {
    return { mode: 'step', specific: '', rangeStart: '', rangeEnd: '', step: trimmed.slice(2) }
  }
  if (trimmed.includes('-')) {
    const [start, end] = trimmed.split('-')
    return { mode: 'range', specific: '', rangeStart: start, rangeEnd: end, step: '' }
  }
  return { mode: 'specific', specific: trimmed, rangeStart: '', rangeEnd: '', step: '' }
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function describeField(value: string, index: number): string {
  if (value === '*') return ''

  if (value.startsWith('*/')) {
    const step = parseInt(value.slice(2))
    if (isNaN(step)) return ''
    const name = FIELD_NAMES[index].toLowerCase()
    return `every ${step} ${name}${step > 1 ? 's' : ''}`
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-').map(Number)
    if (index === 4) return `${DAY_NAMES[start] || start} through ${DAY_NAMES[end] || end}`
    if (index === 3) return `${MONTH_NAMES[start] || start} through ${MONTH_NAMES[end] || end}`
    return `${start}-${end}`
  }

  const num = parseInt(value)
  if (isNaN(num)) return value

  if (index === 4) return DAY_NAMES[num] || String(num)
  if (index === 3) return MONTH_NAMES[num] || String(num)
  return String(num)
}

function describeCron(expression: string): string {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return 'Invalid cron expression'

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  // Every minute
  if (parts.every((p) => p === '*')) return 'Every minute'

  // Simple common cases
  if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const h = parseInt(hour)
    const m = parseInt(minute)
    if (!isNaN(h) && !isNaN(m)) {
      const period = h >= 12 ? 'PM' : 'AM'
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      const mStr = m.toString().padStart(2, '0')
      return `Every day at ${h12}:${mStr} ${period}`
    }
  }

  // Specific day of week
  if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
    const h = parseInt(hour)
    const m = parseInt(minute)
    if (!isNaN(h) && !isNaN(m)) {
      const period = h >= 12 ? 'PM' : 'AM'
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      const mStr = m.toString().padStart(2, '0')
      const dow = describeField(dayOfWeek, 4)
      return `Every ${dow} at ${h12}:${mStr} ${period}`
    }
  }

  // Specific day of month
  if (minute !== '*' && hour !== '*' && dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
    const h = parseInt(hour)
    const m = parseInt(minute)
    const d = parseInt(dayOfMonth)
    if (!isNaN(h) && !isNaN(m) && !isNaN(d)) {
      const period = h >= 12 ? 'PM' : 'AM'
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      const mStr = m.toString().padStart(2, '0')
      return `On the ${getOrdinal(d)} of every month at ${h12}:${mStr} ${period}`
    }
  }

  // Step-based minutes
  if (minute.startsWith('*/') && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const step = parseInt(minute.slice(2))
    if (!isNaN(step)) return `Every ${step} minute${step > 1 ? 's' : ''}`
  }

  // Hourly (minute specific, rest wild)
  if (minute !== '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const m = parseInt(minute)
    if (!isNaN(m)) return `Every hour at minute ${m}`
  }

  // Build a generic description
  const descriptions: string[] = []
  if (minute !== '*') descriptions.push(`minute ${describeField(minute, 0)}`)
  if (hour !== '*') descriptions.push(`hour ${describeField(hour, 1)}`)
  if (dayOfMonth !== '*') descriptions.push(`day ${describeField(dayOfMonth, 2)}`)
  if (month !== '*') descriptions.push(`in ${describeField(month, 3)}`)
  if (dayOfWeek !== '*') descriptions.push(`on ${describeField(dayOfWeek, 4)}`)

  return `At ${descriptions.join(', ')}` || expression
}

function getNextRuns(expression: string, count: number): Date[] {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return []

  const runs: Date[] = []
  const now = new Date()
  const candidate = new Date(now)
  candidate.setSeconds(0)
  candidate.setMilliseconds(0)
  candidate.setMinutes(candidate.getMinutes() + 1)

  const matchField = (value: string, current: number): boolean => {
    if (value === '*') return true
    if (value.startsWith('*/')) {
      const step = parseInt(value.slice(2))
      return !isNaN(step) && step > 0 && current % step === 0
    }
    if (value.includes('-')) {
      const parts = value.split('-').map(Number)
      return current >= parts[0] && current <= parts[1]
    }
    if (value.includes(',')) {
      return value.split(',').map(Number).includes(current)
    }
    return parseInt(value) === current
  }

  let safety = 0
  while (runs.length < count && safety < 525960) {
    safety++
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
    const m = candidate.getMinutes()
    const h = candidate.getHours()
    const dom = candidate.getDate()
    const mon = candidate.getMonth() + 1
    const dow = candidate.getDay()

    if (
      matchField(minute, m) &&
      matchField(hour, h) &&
      matchField(dayOfMonth, dom) &&
      matchField(month, mon) &&
      matchField(dayOfWeek, dow)
    ) {
      runs.push(new Date(candidate))
    }
    candidate.setMinutes(candidate.getMinutes() + 1)
  }

  return runs
}

export default function CronBuilder() {
  const [fields, setFields] = useState<CronField[]>([
    defaultField(),
    defaultField(),
    defaultField(),
    defaultField(),
    defaultField(),
  ])
  const [rawInput, setRawInput] = useState('')

  const expression = useMemo(
    () => fields.map((f, i) => fieldToString(f, i)).join(' '),
    [fields]
  )

  const description = useMemo(() => describeCron(expression), [expression])

  const nextRuns = useMemo(() => getNextRuns(expression, 5), [expression])

  const updateField = useCallback((index: number, update: Partial<CronField>) => {
    setFields((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...update }
      return next
    })
  }, [])

  const applyPreset = useCallback((cron: string) => {
    const parts = cron.trim().split(/\s+/)
    if (parts.length !== 5) return
    setFields(parts.map(parseCronField))
    setRawInput(cron)
  }, [])

  const parsePasted = useCallback(() => {
    const parts = rawInput.trim().split(/\s+/)
    if (parts.length !== 5) return
    setFields(parts.map(parseCronField))
  }, [rawInput])

  const resetAll = useCallback(() => {
    setFields([defaultField(), defaultField(), defaultField(), defaultField(), defaultField()])
    setRawInput('')
  }, [])

  // Sync expression to rawInput when fields change
  useEffect(() => {
    setRawInput(expression)
  }, [expression])

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.cron)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Clock className="w-3 h-3" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Raw Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cron Expression
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="* * * * *"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === 'Enter') parsePasted()
            }}
          />
          <button
            onClick={parsePasted}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Parse
          </button>
          <button
            onClick={resetAll}
            className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Builder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {FIELD_NAMES.map((name, index) => (
          <div key={name} className="border border-gray-300 rounded-md p-3 bg-white">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              {name}
            </label>

            {/* Mode selector */}
            <select
              value={fields[index].mode}
              onChange={(e) => updateField(index, { mode: e.target.value as FieldMode })}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded bg-gray-50 text-gray-900 mb-2 outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="every">Every (*)</option>
              <option value="specific">Specific</option>
              <option value="range">Range</option>
              <option value="step">Step (*/n)</option>
            </select>

            {/* Mode-specific inputs */}
            {fields[index].mode === 'specific' && (
              <input
                type="text"
                value={fields[index].specific}
                onChange={(e) => updateField(index, { specific: e.target.value })}
                placeholder={`${FIELD_RANGES[index].min}-${FIELD_RANGES[index].max}`}
                className="w-full px-2 py-1.5 text-sm font-mono border border-gray-200 rounded bg-gray-50 text-gray-900 outline-none focus:ring-1 focus:ring-gray-400"
              />
            )}
            {fields[index].mode === 'range' && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={fields[index].rangeStart}
                  onChange={(e) => updateField(index, { rangeStart: e.target.value })}
                  placeholder={String(FIELD_RANGES[index].min)}
                  min={FIELD_RANGES[index].min}
                  max={FIELD_RANGES[index].max}
                  className="w-full px-2 py-1.5 text-sm font-mono border border-gray-200 rounded bg-gray-50 text-gray-900 outline-none focus:ring-1 focus:ring-gray-400"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="number"
                  value={fields[index].rangeEnd}
                  onChange={(e) => updateField(index, { rangeEnd: e.target.value })}
                  placeholder={String(FIELD_RANGES[index].max)}
                  min={FIELD_RANGES[index].min}
                  max={FIELD_RANGES[index].max}
                  className="w-full px-2 py-1.5 text-sm font-mono border border-gray-200 rounded bg-gray-50 text-gray-900 outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            )}
            {fields[index].mode === 'step' && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-xs whitespace-nowrap">*/</span>
                <input
                  type="number"
                  value={fields[index].step}
                  onChange={(e) => updateField(index, { step: e.target.value })}
                  placeholder="1"
                  min={1}
                  className="w-full px-2 py-1.5 text-sm font-mono border border-gray-200 rounded bg-gray-50 text-gray-900 outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            )}

            {/* Current value preview */}
            <div className="mt-2 text-center">
              <span className="font-mono text-sm font-bold text-gray-900">
                {fieldToString(fields[index], index)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Expression Preview */}
      <div className="bg-white border border-gray-300 rounded-md p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Generated Expression</label>
        </div>
        <div className="font-mono text-lg font-bold text-gray-900 mb-2 tracking-wider">
          {expression}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Next Runs */}
      {nextRuns.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Next 5 Run Times</label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            {nextRuns.map((run, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 text-sm ${
                  i !== nextRuns.length - 1 ? 'border-b border-gray-200' : ''
                } ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <span className="text-gray-400 font-mono w-6">{i + 1}.</span>
                <span className="font-mono text-gray-900">
                  {run.toLocaleString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
