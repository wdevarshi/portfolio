import React, { useState } from 'react'
import { Exercise } from './types'

interface ExerciseLibraryProps {
    exercises: Exercise[]
    searchQuery: string
    onSearchChange: (query: string) => void
    filterDifficulty: number | null
    onFilterDifficultyChange: (difficulty: number | null) => void
    onAddExercise: (exercise: Exercise) => void
}

export default function ExerciseLibrary({
    exercises,
    searchQuery,
    onSearchChange,
    filterDifficulty,
    onFilterDifficultyChange,
    onAddExercise
}: ExerciseLibraryProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null)
    
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
            lats: 'bg-green-100 text-green-800',
            traps: 'bg-green-100 text-green-800',
            biceps: 'bg-orange-100 text-orange-800',
            triceps: 'bg-orange-100 text-orange-800',
            forearms: 'bg-orange-100 text-orange-800',
            core: 'bg-red-100 text-red-800',
        }
        return colors[muscleGroup] || 'bg-gray-100 text-gray-800'
    }
    
    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            strength: '💪',
            cardio: '🏃',
            flexibility: '🧘',
            mixed: '🏋️'
        }
        return icons[category] || '🏋️'
    }
    
    return (
        <div className="space-y-4">
            <div className="sticky top-0 bg-white z-10 pb-3 space-y-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                    >
                        {viewMode === 'grid' ? '☰' : '⊞'}
                    </button>
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={() => onFilterDifficultyChange(null)}
                        className={`px-3 py-1 rounded-full text-sm ${
                            filterDifficulty === null 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        All Levels
                    </button>
                    {[1, 2, 3, 4, 5].map(level => (
                        <button
                            key={level}
                            onClick={() => onFilterDifficultyChange(level)}
                            className={`px-3 py-1 rounded-full text-sm ${
                                filterDifficulty === level 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            title={`Difficulty ${level}`}
                        >
                            {level}★
                        </button>
                    ))}
                </div>
            </div>
            
            {exercises.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No exercises found matching your criteria
                </div>
            ) : (
                <div className={`max-h-96 overflow-y-auto ${
                    viewMode === 'grid' 
                        ? 'grid grid-cols-2 gap-3' 
                        : 'space-y-2'
                }`}>
                    {exercises.map(exercise => (
                        <div
                            key={exercise.id}
                            className={`bg-white border rounded-lg hover:shadow-md transition-shadow ${
                                viewMode === 'grid' ? 'p-3' : 'p-3'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{getCategoryIcon(exercise.category)}</span>
                                        <h4 className="font-medium text-sm">{exercise.name}</h4>
                                    </div>
                                    
                                    {viewMode === 'list' && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {exercise.muscleGroups.map(mg => (
                                                <span 
                                                    key={mg} 
                                                    className={`px-2 py-0.5 text-xs rounded-full ${getMuscleGroupBadgeColor(mg)}`}
                                                >
                                                    {mg}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                        <span className="text-yellow-600">
                                            {getDifficultyStars(exercise.difficulty)}
                                        </span>
                                        <span>{exercise.equipment.join(', ')}</span>
                                    </div>
                                    
                                    {expandedExercise === exercise.id && (
                                        <div className="mt-3 pt-3 border-t space-y-2">
                                            <div>
                                                <h5 className="font-semibold text-xs text-gray-700 mb-1">Instructions:</h5>
                                                <ol className="text-xs text-gray-600 space-y-0.5">
                                                    {exercise.instructions.map((instruction, idx) => (
                                                        <li key={idx} className="flex">
                                                            <span className="mr-1">{idx + 1}.</span>
                                                            <span>{instruction}</span>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                            
                                            {exercise.tips && exercise.tips.length > 0 && (
                                                <div>
                                                    <h5 className="font-semibold text-xs text-gray-700 mb-1">Tips:</h5>
                                                    <ul className="text-xs text-gray-600 space-y-0.5">
                                                        {exercise.tips.map((tip, idx) => (
                                                            <li key={idx}>• {tip}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
                                                <div>
                                                    <h5 className="font-semibold text-xs text-gray-700 mb-1">Common Mistakes:</h5>
                                                    <ul className="text-xs text-gray-600 space-y-0.5">
                                                        {exercise.commonMistakes.map((mistake, idx) => (
                                                            <li key={idx}>• {mistake}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            {exercise.variations && exercise.variations.length > 0 && (
                                                <div>
                                                    <h5 className="font-semibold text-xs text-gray-700 mb-1">Variations:</h5>
                                                    <div className="flex flex-wrap gap-1">
                                                        {exercise.variations.map((variation, idx) => (
                                                            <span 
                                                                key={idx}
                                                                className="px-2 py-0.5 bg-gray-100 text-xs rounded"
                                                            >
                                                                {variation}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => onAddExercise(exercise)}
                                    className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                    + Add
                                </button>
                                <button
                                    onClick={() => setExpandedExercise(
                                        expandedExercise === exercise.id ? null : exercise.id
                                    )}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                                >
                                    {expandedExercise === exercise.id ? 'Less' : 'More'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="text-xs text-gray-500 text-center">
                Showing {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
            </div>
        </div>
    )
}