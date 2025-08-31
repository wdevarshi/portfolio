import React, { useState } from 'react'
import { MuscleGroup } from './types'
import { warmupExercises, cooldownExercises } from './exerciseData'

interface WarmupCooldownGeneratorProps {
    muscleGroups: MuscleGroup[]
    includeWarmup: boolean
    includeCooldown: boolean
    onToggleWarmup: () => void
    onToggleCooldown: () => void
}

export default function WarmupCooldownGenerator({
    muscleGroups,
    includeWarmup,
    includeCooldown,
    onToggleWarmup,
    onToggleCooldown
}: WarmupCooldownGeneratorProps) {
    const [showWarmupDetails, setShowWarmupDetails] = useState(false)
    const [showCooldownDetails, setShowCooldownDetails] = useState(false)
    
    const getRelevantWarmups = () => {
        if (muscleGroups.length === 0) {
            return warmupExercises.slice(0, 5) // Default warmup
        }
        
        const relevantWarmups = warmupExercises.filter(exercise =>
            exercise.targetMuscles.some(muscle => muscleGroups.includes(muscle))
        )
        
        // Always include some general warmups
        const generalWarmups = warmupExercises.filter(exercise =>
            exercise.name === 'Arm Circles' || 
            exercise.name === 'High Knees' || 
            exercise.name === 'Shoulder Rolls'
        )
        
        const combined = [...new Set([...generalWarmups, ...relevantWarmups])]
        return combined.slice(0, 6)
    }
    
    const getRelevantCooldowns = () => {
        if (muscleGroups.length === 0) {
            return cooldownExercises.slice(0, 5) // Default cooldown
        }
        
        const relevantCooldowns = cooldownExercises.filter(exercise =>
            exercise.targetMuscles.some(muscle => muscleGroups.includes(muscle))
        )
        
        // Always include some general cooldowns
        const generalCooldowns = cooldownExercises.filter(exercise =>
            exercise.name === 'Deep Breathing' || 
            exercise.name === 'Forward Fold' ||
            exercise.name === 'Cat-Cow Stretch'
        )
        
        const combined = [...new Set([...generalCooldowns, ...relevantCooldowns])]
        return combined.slice(0, 6)
    }
    
    const warmupList = getRelevantWarmups()
    const cooldownList = getRelevantCooldowns()
    
    const getTotalWarmupTime = () => {
        return warmupList.reduce((total, exercise) => total + exercise.duration, 0)
    }
    
    const getTotalCooldownTime = () => {
        return cooldownList.reduce((total, exercise) => total + exercise.duration, 0)
    }
    
    return (
        <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="include-warmup"
                            checked={includeWarmup}
                            onChange={onToggleWarmup}
                            className="text-green-600"
                        />
                        <label htmlFor="include-warmup" className="font-semibold text-green-800">
                            Include Warm-up ({Math.round(getTotalWarmupTime() / 60)} minutes)
                        </label>
                    </div>
                    {includeWarmup && (
                        <button
                            onClick={() => setShowWarmupDetails(!showWarmupDetails)}
                            className="text-sm text-green-600 hover:text-green-800"
                        >
                            {showWarmupDetails ? 'Hide' : 'Show'} Details
                        </button>
                    )}
                </div>
                
                {includeWarmup && (
                    <>
                        <p className="text-sm text-green-700 mb-3">
                            Recommended warm-up based on your selected muscle groups
                        </p>
                        
                        {showWarmupDetails && (
                            <div className="space-y-2">
                                {warmupList.map((exercise, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-medium text-sm">{exercise.name}</h4>
                                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                                {exercise.duration}s
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">{exercise.instructions}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {exercise.targetMuscles.map(muscle => (
                                                <span 
                                                    key={muscle}
                                                    className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded"
                                                >
                                                    {muscle}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center">
                                    <div className="inline-flex items-center text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                        ⏱️ Total warmup time: {Math.round(getTotalWarmupTime() / 60)} minutes
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {!showWarmupDetails && (
                            <div className="text-xs text-green-700">
                                {warmupList.length} dynamic exercises targeting your selected muscle groups
                            </div>
                        )}
                    </>
                )}
                
                {!includeWarmup && (
                    <div className="text-xs text-orange-600 bg-orange-100 p-2 rounded">
                        ⚠️ Skipping warm-up increases injury risk. Consider including a brief warm-up.
                    </div>
                )}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="include-cooldown"
                            checked={includeCooldown}
                            onChange={onToggleCooldown}
                            className="text-blue-600"
                        />
                        <label htmlFor="include-cooldown" className="font-semibold text-blue-800">
                            Include Cool-down ({Math.round(getTotalCooldownTime() / 60)} minutes)
                        </label>
                    </div>
                    {includeCooldown && (
                        <button
                            onClick={() => setShowCooldownDetails(!showCooldownDetails)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            {showCooldownDetails ? 'Hide' : 'Show'} Details
                        </button>
                    )}
                </div>
                
                {includeCooldown && (
                    <>
                        <p className="text-sm text-blue-700 mb-3">
                            Recommended cool-down to help recovery and flexibility
                        </p>
                        
                        {showCooldownDetails && (
                            <div className="space-y-2">
                                {cooldownList.map((exercise, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-medium text-sm">{exercise.name}</h4>
                                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                {exercise.duration}s
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">{exercise.instructions}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {exercise.targetMuscles.map(muscle => (
                                                <span 
                                                    key={muscle}
                                                    className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded"
                                                >
                                                    {muscle}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center">
                                    <div className="inline-flex items-center text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                        ⏱️ Total cooldown time: {Math.round(getTotalCooldownTime() / 60)} minutes
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {!showCooldownDetails && (
                            <div className="text-xs text-blue-700">
                                {cooldownList.length} static stretches and relaxation exercises
                            </div>
                        )}
                    </>
                )}
                
                {!includeCooldown && (
                    <div className="text-xs text-orange-600 bg-orange-100 p-2 rounded">
                        ⚠️ Skipping cool-down may reduce recovery. Consider including stretches.
                    </div>
                )}
            </div>
        </div>
    )
}