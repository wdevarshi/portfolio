import React from 'react'
import { MuscleGroup } from './types'

interface MuscleGroupSelectorProps {
    selectedGroups: MuscleGroup[]
    onChange: (groups: MuscleGroup[]) => void
}

export default function MuscleGroupSelector({ selectedGroups, onChange }: MuscleGroupSelectorProps) {
    const muscleGroups: { group: MuscleGroup; label: string; category: string }[] = [
        // Legs
        { group: 'quads', label: 'Quadriceps', category: 'Legs' },
        { group: 'hamstrings', label: 'Hamstrings', category: 'Legs' },
        { group: 'glutes', label: 'Glutes', category: 'Legs' },
        { group: 'calves', label: 'Calves', category: 'Legs' },
        // Upper Body
        { group: 'chest', label: 'Chest', category: 'Upper Body' },
        { group: 'back', label: 'Back', category: 'Upper Body' },
        { group: 'shoulders', label: 'Shoulders', category: 'Upper Body' },
        { group: 'lats', label: 'Lats', category: 'Upper Body' },
        { group: 'traps', label: 'Traps', category: 'Upper Body' },
        // Arms
        { group: 'biceps', label: 'Biceps', category: 'Arms' },
        { group: 'triceps', label: 'Triceps', category: 'Arms' },
        { group: 'forearms', label: 'Forearms', category: 'Arms' },
        // Core
        { group: 'core', label: 'Core/Abs', category: 'Core' }
    ]

    const categories = ['Legs', 'Upper Body', 'Arms', 'Core']

    const toggleMuscleGroup = (group: MuscleGroup) => {
        if (selectedGroups.includes(group)) {
            onChange(selectedGroups.filter(g => g !== group))
        } else {
            onChange([...selectedGroups, group])
        }
    }

    const selectAll = () => {
        onChange(muscleGroups.map(mg => mg.group))
    }

    const clearAll = () => {
        onChange([])
    }

    const getMuscleColor = (group: MuscleGroup): string => {
        const colors: Record<string, string> = {
            // Legs - Blues
            quads: 'bg-blue-400',
            hamstrings: 'bg-blue-500',
            glutes: 'bg-blue-600',
            calves: 'bg-blue-700',
            // Upper Body - Greens
            chest: 'bg-green-400',
            back: 'bg-green-500',
            shoulders: 'bg-green-600',
            lats: 'bg-green-700',
            traps: 'bg-green-800',
            // Arms - Oranges
            biceps: 'bg-orange-400',
            triceps: 'bg-orange-500',
            forearms: 'bg-orange-600',
            // Core - Red
            core: 'bg-red-500'
        }
        return colors[group] || 'bg-gray-400'
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Target Muscle Groups</h3>
                <div className="space-x-2">
                    <button
                        onClick={selectAll}
                        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Select All
                    </button>
                    <button
                        onClick={clearAll}
                        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    {categories.map(category => (
                        <div key={category}>
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">{category}</h4>
                            <div className="space-y-1">
                                {muscleGroups
                                    .filter(mg => mg.category === category)
                                    .map(({ group, label }) => (
                                        <label
                                            key={group}
                                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedGroups.includes(group)}
                                                onChange={() => toggleMuscleGroup(group)}
                                                className="rounded text-blue-600"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded ${getMuscleColor(group)}`} />
                                                <span className="text-sm">{label}</span>
                                            </div>
                                        </label>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Visual Muscle Map</h4>
                    <div className="relative">
                        <svg viewBox="0 0 200 400" className="w-full max-w-xs mx-auto">
                            {/* Simplified human figure */}
                            <g>
                                {/* Head */}
                                <circle cx="100" cy="40" r="20" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2"/>
                                
                                {/* Torso */}
                                <rect x="75" y="60" width="50" height="80" 
                                    fill={selectedGroups.includes('chest') || selectedGroups.includes('core') ? '#86efac' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                                
                                {/* Arms */}
                                <rect x="40" y="70" width="30" height="60" 
                                    fill={selectedGroups.includes('biceps') || selectedGroups.includes('triceps') ? '#fdba74' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                                <rect x="130" y="70" width="30" height="60" 
                                    fill={selectedGroups.includes('biceps') || selectedGroups.includes('triceps') ? '#fdba74' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                                
                                {/* Shoulders */}
                                <circle cx="65" cy="70" r="10" 
                                    fill={selectedGroups.includes('shoulders') ? '#4ade80' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                                <circle cx="135" cy="70" r="10" 
                                    fill={selectedGroups.includes('shoulders') ? '#4ade80' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                                
                                {/* Core */}
                                <rect x="80" y="100" width="40" height="35" 
                                    fill={selectedGroups.includes('core') ? '#ef4444' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                                
                                {/* Legs - Quads */}
                                <rect x="75" y="140" width="20" height="80" 
                                    fill={selectedGroups.includes('quads') ? '#60a5fa' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                                <rect x="105" y="140" width="20" height="80" 
                                    fill={selectedGroups.includes('quads') ? '#60a5fa' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                                
                                {/* Glutes */}
                                <ellipse cx="100" cy="145" rx="30" ry="15" 
                                    fill={selectedGroups.includes('glutes') ? '#3b82f6' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                                
                                {/* Calves */}
                                <rect x="75" y="220" width="20" height="50" 
                                    fill={selectedGroups.includes('calves') ? '#1e40af' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                                <rect x="105" y="220" width="20" height="50" 
                                    fill={selectedGroups.includes('calves') ? '#1e40af' : '#f3f4f6'} 
                                    stroke="#9ca3af" strokeWidth="2"/>
                            </g>
                        </svg>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 text-center">
                        Click muscle groups to highlight
                    </div>
                </div>
            </div>

            {selectedGroups.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Selected:</strong> {selectedGroups.length} muscle group{selectedGroups.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    )
}