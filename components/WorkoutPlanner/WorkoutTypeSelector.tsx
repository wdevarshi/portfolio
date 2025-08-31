import React from 'react'
import { WorkoutType } from './types'

interface WorkoutTypeSelectorProps {
    workoutType: WorkoutType
    onChange: (type: WorkoutType) => void
}

export default function WorkoutTypeSelector({ workoutType, onChange }: WorkoutTypeSelectorProps) {
    const types: { value: WorkoutType; label: string; description: string; icon: string }[] = [
        {
            value: 'strength',
            label: 'Strength Training',
            description: 'Build muscle and increase strength',
            icon: '💪'
        },
        {
            value: 'cardio',
            label: 'Cardio',
            description: 'Improve cardiovascular fitness',
            icon: '🏃'
        },
        {
            value: 'flexibility',
            label: 'Flexibility/Mobility',
            description: 'Increase range of motion',
            icon: '🧘'
        },
        {
            value: 'mixed',
            label: 'Mixed',
            description: 'Combination of all types',
            icon: '🏋️'
        }
    ]

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold">Workout Type</h3>
            <div className="grid grid-cols-2 gap-3">
                {types.map((type) => (
                    <button
                        key={type.value}
                        onClick={() => onChange(type.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                            workoutType === type.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                    </button>
                ))}
            </div>
        </div>
    )
}