import React from 'react'
import { ExperienceLevel } from './types'

interface ExperienceLevelSelectorProps {
    level: ExperienceLevel
    onChange: (level: ExperienceLevel) => void
}

export default function ExperienceLevelSelector({ level, onChange }: ExperienceLevelSelectorProps) {
    const levels: { value: ExperienceLevel; label: string; description: string; recommendations: string[] }[] = [
        {
            value: 'beginner',
            label: 'Beginner',
            description: 'New to exercise or returning after a long break',
            recommendations: [
                '2-3 workouts per week',
                'Focus on form and technique',
                'Start with bodyweight exercises',
                '2-3 sets per exercise'
            ]
        },
        {
            value: 'intermediate',
            label: 'Intermediate',
            description: 'Regular exercise for 6+ months',
            recommendations: [
                '3-5 workouts per week',
                'Progressive overload',
                'Mix of compound and isolation exercises',
                '3-4 sets per exercise'
            ]
        },
        {
            value: 'advanced',
            label: 'Advanced',
            description: 'Consistent training for 2+ years',
            recommendations: [
                '4-6 workouts per week',
                'Advanced techniques (supersets, drop sets)',
                'Higher volume and intensity',
                '4-5 sets per exercise'
            ]
        }
    ]

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold">Experience Level</h3>
            <div className="space-y-2">
                {levels.map((levelOption) => (
                    <div
                        key={levelOption.value}
                        onClick={() => onChange(levelOption.value)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            level === levelOption.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        checked={level === levelOption.value}
                                        onChange={() => onChange(levelOption.value)}
                                        className="text-blue-600"
                                    />
                                    <label className="font-medium">{levelOption.label}</label>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 ml-6">{levelOption.description}</p>
                                {level === levelOption.value && (
                                    <div className="mt-2 ml-6">
                                        <p className="text-xs font-semibold text-gray-700 mb-1">Recommendations:</p>
                                        <ul className="text-xs text-gray-600 space-y-0.5">
                                            {levelOption.recommendations.map((rec, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="mr-1">•</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="ml-3">
                                {levelOption.value === 'beginner' && (
                                    <div className="flex space-x-0.5">
                                        <div className="w-2 h-4 bg-green-400 rounded-sm"></div>
                                        <div className="w-2 h-4 bg-gray-300 rounded-sm"></div>
                                        <div className="w-2 h-4 bg-gray-300 rounded-sm"></div>
                                    </div>
                                )}
                                {levelOption.value === 'intermediate' && (
                                    <div className="flex space-x-0.5">
                                        <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>
                                        <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>
                                        <div className="w-2 h-4 bg-gray-300 rounded-sm"></div>
                                    </div>
                                )}
                                {levelOption.value === 'advanced' && (
                                    <div className="flex space-x-0.5">
                                        <div className="w-2 h-4 bg-red-400 rounded-sm"></div>
                                        <div className="w-2 h-4 bg-red-400 rounded-sm"></div>
                                        <div className="w-2 h-4 bg-red-400 rounded-sm"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}