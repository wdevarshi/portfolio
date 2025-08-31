'use client'

import React, { useState, useEffect } from 'react'
// import { DndProvider } from 'react-dnd'
// import { HTML5Backend } from 'react-dnd-html5-backend'
import WorkoutTypeSelector from './WorkoutTypeSelector'
import MuscleGroupSelector from './MuscleGroupSelector'
import ExperienceLevelSelector from './ExperienceLevelSelector'
import WorkoutBuilder from './WorkoutBuilder'
import ExerciseLibrary from './ExerciseLibrary'
import WarmupCooldownGenerator from './WarmupCooldownGenerator'
import WorkoutCustomization from './WorkoutCustomization'
import SaveExportFeatures from './SaveExportFeatures'
import ProgressDashboard from './ProgressDashboard'
import LiveWorkoutTimer from './LiveWorkoutTimer'
import { WorkoutType, MuscleGroup, ExperienceLevel, Exercise, WorkoutPlan, Equipment } from './types'
import { exerciseDatabase } from './exerciseData'

export default function WorkoutPlanner() {
    const [workoutType, setWorkoutType] = useState<WorkoutType>('strength')
    const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([])
    const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('intermediate')
    const [duration, setDuration] = useState(30)
    const [equipment, setEquipment] = useState<Equipment[]>(['none'])
    const [restTime, setRestTime] = useState(60)
    const [workoutPlan, setWorkoutPlan] = useState<Exercise[]>([])
    const [savedWorkouts, setSavedWorkouts] = useState<WorkoutPlan[]>([])
    // const [isTimerActive, setIsTimerActive] = useState(false)
    const [currentView, setCurrentView] = useState<'builder' | 'timer' | 'progress'>('builder')
    const [searchQuery, setSearchQuery] = useState('')
    const [filterDifficulty, setFilterDifficulty] = useState<number | null>(null)
    const [includeWarmup, setIncludeWarmup] = useState(true)
    const [includeCooldown, setIncludeCooldown] = useState(true)

    useEffect(() => {
        const saved = localStorage.getItem('savedWorkouts')
        if (saved) {
            setSavedWorkouts(JSON.parse(saved))
        }
    }, [])

    const handleSaveWorkout = (name: string, category: string) => {
        const newWorkout: WorkoutPlan = {
            id: Date.now().toString(),
            name,
            category,
            exercises: workoutPlan,
            duration,
            equipment,
            muscleGroups: selectedMuscleGroups,
            experienceLevel,
            createdAt: new Date().toISOString(),
            includeWarmup,
            includeCooldown
        }
        
        const updated = [...savedWorkouts, newWorkout]
        setSavedWorkouts(updated)
        localStorage.setItem('savedWorkouts', JSON.stringify(updated))
    }

    const handleLoadWorkout = (workout: WorkoutPlan) => {
        setWorkoutPlan(workout.exercises)
        setDuration(workout.duration)
        setEquipment(workout.equipment)
        setSelectedMuscleGroups(workout.muscleGroups)
        setExperienceLevel(workout.experienceLevel)
        setIncludeWarmup(workout.includeWarmup || true)
        setIncludeCooldown(workout.includeCooldown || true)
    }

    const handleDeleteWorkout = (id: string) => {
        const updated = savedWorkouts.filter(w => w.id !== id)
        setSavedWorkouts(updated)
        localStorage.setItem('savedWorkouts', JSON.stringify(updated))
    }

    const addExerciseToWorkout = (exercise: Exercise) => {
        setWorkoutPlan([...workoutPlan, { ...exercise, id: `${exercise.id}-${Date.now()}` }])
    }

    const removeExerciseFromWorkout = (exerciseId: string) => {
        setWorkoutPlan(workoutPlan.filter(e => e.id !== exerciseId))
    }

    const updateExerciseInWorkout = (exerciseId: string, updates: Partial<Exercise>) => {
        setWorkoutPlan(workoutPlan.map(e => 
            e.id === exerciseId ? { ...e, ...updates } : e
        ))
    }

    // const reorderExercises = (dragIndex: number, dropIndex: number) => {
    //     const draggedExercise = workoutPlan[dragIndex]
    //     const newPlan = [...workoutPlan]
    //     newPlan.splice(dragIndex, 1)
    //     newPlan.splice(dropIndex, 0, draggedExercise)
    //     setWorkoutPlan(newPlan)
    // }

    const getFilteredExercises = () => {
        return exerciseDatabase.filter(exercise => {
            const matchesType = exercise.category === workoutType || workoutType === 'mixed'
            const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesDifficulty = filterDifficulty === null || exercise.difficulty === filterDifficulty
            const matchesEquipment = equipment.includes('full-gym') || 
                exercise.equipment.some(eq => equipment.includes(eq))
            const matchesMuscleGroups = selectedMuscleGroups.length === 0 || 
                exercise.muscleGroups.some(mg => selectedMuscleGroups.includes(mg))
            
            return matchesType && matchesSearch && matchesDifficulty && matchesEquipment && matchesMuscleGroups
        })
    }

    const estimateWorkoutDifficulty = () => {
        if (workoutPlan.length === 0) return 0
        const avgDifficulty = workoutPlan.reduce((sum, ex) => sum + ex.difficulty, 0) / workoutPlan.length
        const volumeFactor = Math.min(workoutPlan.length / 10, 1)
        return Math.round((avgDifficulty * 0.7 + volumeFactor * 5 * 0.3))
    }

    const checkMuscleBalance = () => {
        const muscleCount: Record<string, number> = {}
        workoutPlan.forEach(exercise => {
            exercise.muscleGroups.forEach(mg => {
                muscleCount[mg] = (muscleCount[mg] || 0) + 1
            })
        })
        
        const maxCount = Math.max(...Object.values(muscleCount))
        const minCount = Math.min(...Object.values(muscleCount))
        
        return maxCount - minCount <= 3
    }

    return (
        // <DndProvider backend={HTML5Backend}>
            <div className="space-y-6">
                <div className="flex gap-4 border-b pb-4">
                    <button
                        onClick={() => setCurrentView('builder')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            currentView === 'builder' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        Workout Builder
                    </button>
                    <button
                        onClick={() => setCurrentView('timer')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            currentView === 'timer' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        disabled={workoutPlan.length === 0}
                    >
                        Live Workout
                    </button>
                    <button
                        onClick={() => setCurrentView('progress')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            currentView === 'progress' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        Progress
                    </button>
                </div>

                {currentView === 'builder' && (
                    <>
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <WorkoutTypeSelector 
                                    workoutType={workoutType}
                                    onChange={setWorkoutType}
                                />
                                
                                <ExperienceLevelSelector
                                    level={experienceLevel}
                                    onChange={setExperienceLevel}
                                />
                                
                                <WorkoutCustomization
                                    duration={duration}
                                    equipment={equipment}
                                    restTime={restTime}
                                    onDurationChange={setDuration}
                                    onEquipmentChange={setEquipment}
                                    onRestTimeChange={setRestTime}
                                />
                            </div>
                            
                            <div className="lg:col-span-2">
                                <MuscleGroupSelector
                                    selectedGroups={selectedMuscleGroups}
                                    onChange={setSelectedMuscleGroups}
                                />
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Exercise Library</h2>
                                <ExerciseLibrary
                                    exercises={getFilteredExercises()}
                                    searchQuery={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    filterDifficulty={filterDifficulty}
                                    onFilterDifficultyChange={setFilterDifficulty}
                                    onAddExercise={addExerciseToWorkout}
                                />
                            </div>
                            
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Your Workout Plan</h2>
                                
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Workout Difficulty</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div
                                                    key={i}
                                                    className={`w-8 h-2 rounded ${
                                                        i <= estimateWorkoutDifficulty()
                                                            ? 'bg-orange-500'
                                                            : 'bg-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {!checkMuscleBalance() && workoutPlan.length > 3 && (
                                        <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-sm">
                                            ⚠️ Consider adding exercises for other muscle groups for a balanced workout
                                        </div>
                                    )}
                                </div>

                                <WarmupCooldownGenerator
                                    muscleGroups={selectedMuscleGroups}
                                    includeWarmup={includeWarmup}
                                    includeCooldown={includeCooldown}
                                    onToggleWarmup={() => setIncludeWarmup(!includeWarmup)}
                                    onToggleCooldown={() => setIncludeCooldown(!includeCooldown)}
                                />
                                
                                <WorkoutBuilder
                                    exercises={workoutPlan}
                                    onRemoveExercise={removeExerciseFromWorkout}
                                    onUpdateExercise={updateExerciseInWorkout}
                                />
                                
                                <SaveExportFeatures
                                    workoutPlan={workoutPlan}
                                    savedWorkouts={savedWorkouts}
                                    onSaveWorkout={handleSaveWorkout}
                                    onLoadWorkout={handleLoadWorkout}
                                    onDeleteWorkout={handleDeleteWorkout}
                                    includeWarmup={includeWarmup}
                                    includeCooldown={includeCooldown}
                                />
                            </div>
                        </div>
                    </>
                )}

                {currentView === 'timer' && (
                    <LiveWorkoutTimer
                        workoutPlan={workoutPlan}
                        restTime={restTime}
                        includeWarmup={includeWarmup}
                        includeCooldown={includeCooldown}
                        onComplete={() => {
                            const completedWorkouts = JSON.parse(
                                localStorage.getItem('completedWorkouts') || '[]'
                            )
                            completedWorkouts.push({
                                date: new Date().toISOString(),
                                exercises: workoutPlan.length,
                                duration,
                                muscleGroups: selectedMuscleGroups
                            })
                            localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts))
                            setCurrentView('progress')
                        }}
                    />
                )}

                {currentView === 'progress' && (
                    <ProgressDashboard />
                )}
            </div>
        // </DndProvider>
    )
}