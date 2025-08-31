import React from 'react'
import { Exercise } from './types'

interface WorkoutBuilderProps {
    exercises: Exercise[]
    onRemoveExercise: (id: string) => void
    onUpdateExercise: (id: string, updates: Partial<Exercise>) => void
    onReorderExercises: (dragIndex: number, dropIndex: number) => void
}

function ExerciseCard({ 
    exercise, 
    index, 
    onRemove, 
    onUpdate
}: { 
    exercise: Exercise
    index: number
    onRemove: () => void
    onUpdate: (updates: Partial<Exercise>) => void
}) {
    
    const getDifficultyStars = (difficulty: number) => {
        return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)
    }
    
    const getMuscleGroupBadgeColor = (muscleGroup: string) => {
        const colors: Record<string, string> = {
            quads: 'bg-blue-100 text-blue-800',
            hamstrings: 'bg-blue-100 text-blue-800',
            glutes: 'bg-blue-100 text-blue-800',
            calves: 'bg-blue-100 text-blue-800',
            chest: 'bg-green-100 text-green-800',
            back: 'bg-green-100 text-green-800',
            shoulders: 'bg-green-100 text-green-800',
            biceps: 'bg-orange-100 text-orange-800',
            triceps: 'bg-orange-100 text-orange-800',
            core: 'bg-red-100 text-red-800',
        }
        return colors[muscleGroup] || 'bg-gray-100 text-gray-800'
    }
    
    return (
        <div
            className="bg-white border-2 rounded-lg p-4 mb-3 transition-opacity"
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">#{index + 1}</span>
                        <h4 className="font-semibold">{exercise.name}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {exercise.muscleGroups.map(mg => (
                            <span 
                                key={mg} 
                                className={`px-2 py-0.5 text-xs rounded-full ${getMuscleGroupBadgeColor(mg)}`}
                            >
                                {mg}
                            </span>
                        ))}
                    </div>
                </div>
                <button
                    onClick={onRemove}
                    className="text-red-500 hover:text-red-700 ml-2"
                >
                    ✕
                </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                    <label className="text-xs text-gray-600">Sets</label>
                    <input
                        type="number"
                        value={exercise.sets || 3}
                        onChange={(e) => onUpdate({ sets: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border rounded text-sm"
                        min="1"
                        max="10"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-600">Reps</label>
                    <input
                        type="text"
                        value={exercise.reps || '10-12'}
                        onChange={(e) => onUpdate({ reps: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-600">Rest (s)</label>
                    <input
                        type="number"
                        value={exercise.restTime || 60}
                        onChange={(e) => onUpdate({ restTime: parseInt(e.target.value) })}
                        className="w-full px-2 py-1 border rounded text-sm"
                        min="15"
                        max="300"
                        step="15"
                    />
                </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-yellow-600">{getDifficultyStars(exercise.difficulty)}</span>
                <span className="text-gray-500">
                    {exercise.equipment.join(', ')}
                </span>
            </div>
        </div>
    )
}

export default function WorkoutBuilder({
    exercises,
    onRemoveExercise,
    onUpdateExercise
}: Omit<WorkoutBuilderProps, 'onReorderExercises'>) {
    
    const getTotalDuration = () => {
        let totalSeconds = 0
        exercises.forEach(exercise => {
            const sets = exercise.sets || 3
            const restTime = exercise.restTime || 60
            const exerciseTime = exercise.duration || 45 // Assume 45s per set if not specified
            totalSeconds += (exerciseTime * sets) + (restTime * (sets - 1))
        })
        return Math.round(totalSeconds / 60)
    }
    
    return (
        <div className="space-y-4">
            {exercises.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">
                        No exercises added yet. Drag exercises from the library or click &quot;Add to Workout&quot;
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm">
                            <span>
                                <strong>{exercises.length}</strong> exercises
                            </span>
                            <span>
                                Estimated duration: <strong>{getTotalDuration()} minutes</strong>
                            </span>
                        </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {exercises.map((exercise, index) => (
                            <ExerciseCard
                                key={exercise.id}
                                index={index}
                                exercise={exercise}
                                onRemove={() => onRemoveExercise(exercise.id)}
                                onUpdate={(updates) => onUpdateExercise(exercise.id, updates)}
                            />
                        ))}
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center">
                        Use up/down buttons to reorder exercises
                    </div>
                </>
            )}
        </div>
    )
}