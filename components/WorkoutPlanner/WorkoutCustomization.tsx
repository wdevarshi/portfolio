import React from 'react'
import { Equipment } from './types'

interface WorkoutCustomizationProps {
    duration: number
    equipment: Equipment[]
    restTime: number
    onDurationChange: (duration: number) => void
    onEquipmentChange: (equipment: Equipment[]) => void
    onRestTimeChange: (restTime: number) => void
}

export default function WorkoutCustomization({
    duration,
    equipment,
    restTime,
    onDurationChange,
    onEquipmentChange,
    onRestTimeChange
}: WorkoutCustomizationProps) {
    const durations = [15, 30, 45, 60]
    const restTimes = [30, 45, 60, 90, 120]
    
    const equipmentOptions: { value: Equipment; label: string; icon: string }[] = [
        { value: 'none', label: 'Bodyweight', icon: '🤸' },
        { value: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
        { value: 'barbell', label: 'Barbell', icon: '🏋️‍♂️' },
        { value: 'resistance-bands', label: 'Bands', icon: '🎯' },
        { value: 'kettlebell', label: 'Kettlebell', icon: '🔔' },
        { value: 'pull-up-bar', label: 'Pull-up Bar', icon: '🚪' },
        { value: 'full-gym', label: 'Full Gym', icon: '🏢' }
    ]
    
    const toggleEquipment = (equip: Equipment) => {
        if (equip === 'full-gym') {
            if (equipment.includes('full-gym')) {
                onEquipmentChange(['none'])
            } else {
                onEquipmentChange(['full-gym'])
            }
        } else {
            if (equipment.includes(equip)) {
                const newEquipment = equipment.filter(e => e !== equip)
                onEquipmentChange(newEquipment.length > 0 ? newEquipment : ['none'])
            } else {
                const newEquipment = equipment.filter(e => e !== 'full-gym')
                if (equip === 'none') {
                    onEquipmentChange(['none'])
                } else {
                    onEquipmentChange([...newEquipment.filter(e => e !== 'none'), equip])
                }
            }
        }
    }
    
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Workout Settings</h3>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {durations.map(d => (
                        <button
                            key={d}
                            onClick={() => onDurationChange(d)}
                            className={`py-2 px-3 rounded-lg border-2 transition-all ${
                                duration === d
                                    ? 'border-blue-500 bg-blue-50 font-semibold'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
                <div className="mt-2">
                    <input
                        type="range"
                        min="10"
                        max="90"
                        step="5"
                        value={duration}
                        onChange={(e) => onDurationChange(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                        Custom: {duration} minutes
                    </div>
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Equipment
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {equipmentOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => toggleEquipment(option.value)}
                            className={`py-2 px-3 rounded-lg border-2 transition-all flex items-center justify-center gap-1 ${
                                equipment.includes(option.value)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <span>{option.icon}</span>
                            <span className="text-sm">{option.label}</span>
                        </button>
                    ))}
                </div>
                {equipment.includes('full-gym') && (
                    <p className="text-xs text-blue-600 mt-2">
                        Full gym access includes all equipment types
                    </p>
                )}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rest Time Between Sets (seconds)
                </label>
                <div className="grid grid-cols-5 gap-2">
                    {restTimes.map(rt => (
                        <button
                            key={rt}
                            onClick={() => onRestTimeChange(rt)}
                            className={`py-2 px-2 rounded-lg border-2 transition-all text-sm ${
                                restTime === rt
                                    ? 'border-blue-500 bg-blue-50 font-semibold'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {rt}s
                        </button>
                    ))}
                </div>
                <div className="mt-2">
                    <input
                        type="range"
                        min="15"
                        max="180"
                        step="15"
                        value={restTime}
                        onChange={(e) => onRestTimeChange(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                        Custom: {restTime} seconds
                    </div>
                </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                    <span className="text-yellow-600 mr-2">💡</span>
                    <div className="text-xs text-yellow-800">
                        <p className="font-semibold mb-1">Rest Time Guidelines:</p>
                        <ul className="space-y-0.5">
                            <li>• <strong>30-60s:</strong> Endurance & fat loss</li>
                            <li>• <strong>60-90s:</strong> Muscle growth</li>
                            <li>• <strong>90-180s:</strong> Strength & power</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}