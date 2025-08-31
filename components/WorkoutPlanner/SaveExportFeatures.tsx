import React, { useState } from 'react'
import { Exercise, WorkoutPlan } from './types'
import jsPDF from 'jspdf'

interface SaveExportFeaturesProps {
    workoutPlan: Exercise[]
    savedWorkouts: WorkoutPlan[]
    onSaveWorkout: (name: string, category: string) => void
    onLoadWorkout: (workout: WorkoutPlan) => void
    onDeleteWorkout: (id: string) => void
    includeWarmup: boolean
    includeCooldown: boolean
}

export default function SaveExportFeatures({
    workoutPlan,
    savedWorkouts,
    onSaveWorkout,
    onLoadWorkout,
    onDeleteWorkout,
    includeWarmup,
    includeCooldown
}: SaveExportFeaturesProps) {
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [showLoadModal, setShowLoadModal] = useState(false)
    const [workoutName, setWorkoutName] = useState('')
    const [workoutCategory, setWorkoutCategory] = useState('')
    const [shareUrl, setShareUrl] = useState('')
    const [showShareModal, setShowShareModal] = useState(false)
    
    const handleSave = () => {
        if (workoutName.trim() && workoutCategory.trim()) {
            onSaveWorkout(workoutName.trim(), workoutCategory.trim())
            setWorkoutName('')
            setWorkoutCategory('')
            setShowSaveModal(false)
        }
    }
    
    const generateShareUrl = () => {
        const workoutData = {
            exercises: workoutPlan.map(ex => ({
                id: ex.id,
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                restTime: ex.restTime
            })),
            includeWarmup,
            includeCooldown
        }
        
        const encodedData = btoa(JSON.stringify(workoutData))
        const url = `${window.location.origin}${window.location.pathname}?workout=${encodedData}`
        setShareUrl(url)
        setShowShareModal(true)
    }
    
    const copyShareUrl = () => {
        navigator.clipboard.writeText(shareUrl)
        alert('Workout URL copied to clipboard!')
    }
    
    const exportToPDF = () => {
        const pdf = new jsPDF()
        const pageHeight = pdf.internal.pageSize.height
        let yPosition = 20
        
        // Title
        pdf.setFontSize(20)
        pdf.text('My Workout Plan', 20, yPosition)
        yPosition += 15
        
        pdf.setFontSize(12)
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition)
        yPosition += 10
        pdf.text(`Total Exercises: ${workoutPlan.length}`, 20, yPosition)
        yPosition += 20
        
        // Disclaimer
        pdf.setFontSize(10)
        pdf.text('⚠️ Please consult with a healthcare provider before starting any new exercise program.', 20, yPosition)
        yPosition += 20
        
        // Warmup
        if (includeWarmup) {
            pdf.setFontSize(14)
            pdf.text('WARM-UP (5-10 minutes)', 20, yPosition)
            yPosition += 10
            pdf.setFontSize(10)
            pdf.text('• Arm circles (30s)', 20, yPosition)
            yPosition += 5
            pdf.text('• High knees (30s)', 20, yPosition)
            yPosition += 5
            pdf.text('• Leg swings (30s)', 20, yPosition)
            yPosition += 5
            pdf.text('• Torso twists (30s)', 20, yPosition)
            yPosition += 15
        }
        
        // Exercises
        pdf.setFontSize(14)
        pdf.text('MAIN WORKOUT', 20, yPosition)
        yPosition += 15
        
        workoutPlan.forEach((exercise, index) => {
            if (yPosition > pageHeight - 40) {
                pdf.addPage()
                yPosition = 20
            }
            
            pdf.setFontSize(12)
            pdf.text(`${index + 1}. ${exercise.name}`, 20, yPosition)
            yPosition += 7
            
            pdf.setFontSize(10)
            pdf.text(`Sets: ${exercise.sets || 3} | Reps: ${exercise.reps || '10-12'} | Rest: ${exercise.restTime || 60}s`, 25, yPosition)
            yPosition += 5
            
            pdf.text(`Muscles: ${exercise.muscleGroups.join(', ')}`, 25, yPosition)
            yPosition += 10
            
            // Instructions
            if (exercise.instructions && exercise.instructions.length > 0) {
                pdf.text('Instructions:', 25, yPosition)
                yPosition += 5
                exercise.instructions.forEach((instruction, i) => {
                    const lines = pdf.splitTextToSize(`${i + 1}. ${instruction}`, 150)
                    lines.forEach((line: string) => {
                        if (yPosition > pageHeight - 20) {
                            pdf.addPage()
                            yPosition = 20
                        }
                        pdf.text(line, 30, yPosition)
                        yPosition += 4
                    })
                })
                yPosition += 5
            }
            
            yPosition += 5
        })
        
        // Cooldown
        if (includeCooldown) {
            if (yPosition > pageHeight - 60) {
                pdf.addPage()
                yPosition = 20
            }
            
            pdf.setFontSize(14)
            pdf.text('COOL-DOWN (5-10 minutes)', 20, yPosition)
            yPosition += 10
            pdf.setFontSize(10)
            pdf.text('• Forward fold (45s)', 20, yPosition)
            yPosition += 5
            pdf.text('• Shoulder stretch (30s each)', 20, yPosition)
            yPosition += 5
            pdf.text('• Calf stretch (30s each)', 20, yPosition)
            yPosition += 5
            pdf.text('• Deep breathing (60s)', 20, yPosition)
        }
        
        pdf.save('workout-plan.pdf')
    }
    
    const exportToText = () => {
        let content = 'MY WORKOUT PLAN\\n'
        content += `Generated on: ${new Date().toLocaleDateString()}\\n`
        content += `Total Exercises: ${workoutPlan.length}\\n\\n`
        
        if (includeWarmup) {
            content += 'WARM-UP (5-10 minutes)\\n'
            content += '• Arm circles (30s)\\n'
            content += '• High knees (30s)\\n'
            content += '• Leg swings (30s)\\n'
            content += '• Torso twists (30s)\\n\\n'
        }
        
        content += 'MAIN WORKOUT\\n\\n'
        workoutPlan.forEach((exercise, index) => {
            content += `${index + 1}. ${exercise.name}\\n`
            content += `   Sets: ${exercise.sets || 3} | Reps: ${exercise.reps || '10-12'} | Rest: ${exercise.restTime || 60}s\\n`
            content += `   Muscles: ${exercise.muscleGroups.join(', ')}\\n`
            if (exercise.instructions) {
                content += `   Instructions:\\n`
                exercise.instructions.forEach((instruction, i) => {
                    content += `   ${i + 1}. ${instruction}\\n`
                })
            }
            content += '\\n'
        })
        
        if (includeCooldown) {
            content += 'COOL-DOWN (5-10 minutes)\\n'
            content += '• Forward fold (45s)\\n'
            content += '• Shoulder stretch (30s each)\\n'
            content += '• Calf stretch (30s each)\\n'
            content += '• Deep breathing (60s)\\n'
        }
        
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'workout-plan.txt'
        a.click()
        URL.revokeObjectURL(url)
    }
    
    return (
        <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Save & Export</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                        onClick={() => setShowSaveModal(true)}
                        disabled={workoutPlan.length === 0}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                    >
                        💾 Save Workout
                    </button>
                    <button
                        onClick={() => setShowLoadModal(true)}
                        disabled={savedWorkouts.length === 0}
                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                    >
                        📁 Load Workout
                    </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={exportToPDF}
                        disabled={workoutPlan.length === 0}
                        className="px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-xs"
                    >
                        📄 PDF
                    </button>
                    <button
                        onClick={exportToText}
                        disabled={workoutPlan.length === 0}
                        className="px-2 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-xs"
                    >
                        📝 Text
                    </button>
                    <button
                        onClick={generateShareUrl}
                        disabled={workoutPlan.length === 0}
                        className="px-2 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-xs"
                    >
                        🔗 Share
                    </button>
                </div>
                
                {savedWorkouts.length > 0 && (
                    <p className="text-xs text-gray-600 mt-2">
                        {savedWorkouts.length} saved workout{savedWorkouts.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>
            
            {/* Save Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Save Workout</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Workout Name</label>
                                <input
                                    type="text"
                                    value={workoutName}
                                    onChange={(e) => setWorkoutName(e.target.value)}
                                    placeholder="e.g., Upper Body Strength"
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <input
                                    type="text"
                                    value={workoutCategory}
                                    onChange={(e) => setWorkoutCategory(e.target.value)}
                                    placeholder="e.g., Strength, Cardio, Full Body"
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={handleSave}
                                disabled={!workoutName.trim() || !workoutCategory.trim()}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Load Modal */}
            {showLoadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-96">
                        <h3 className="text-lg font-semibold mb-4">Load Saved Workout</h3>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {savedWorkouts.map(workout => (
                                <div key={workout.id} className="border rounded p-3 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{workout.name}</h4>
                                            <p className="text-sm text-gray-600">{workout.category}</p>
                                            <p className="text-xs text-gray-500">
                                                {workout.exercises.length} exercises • 
                                                {new Date(workout.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    onLoadWorkout(workout)
                                                    setShowLoadModal(false)
                                                }}
                                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                            >
                                                Load
                                            </button>
                                            <button
                                                onClick={() => onDeleteWorkout(workout.id)}
                                                className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowLoadModal(false)}
                            className="w-full mt-4 px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            
            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Share Workout</h3>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">
                                Share this URL to let others access your workout:
                            </p>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 px-3 py-2 border rounded-l bg-gray-50 text-xs"
                                />
                                <button
                                    onClick={copyShareUrl}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 text-xs"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowShareModal(false)}
                            className="w-full mt-4 px-4 py-2 border rounded hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}