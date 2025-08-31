import React, { useState, useEffect } from 'react'
import { CompletedWorkout, MuscleGroup } from './types'

export default function ProgressDashboard() {
    const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([])
    const [currentStreak, setCurrentStreak] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    
    useEffect(() => {
        const completed = JSON.parse(localStorage.getItem('completedWorkouts') || '[]')
        setCompletedWorkouts(completed)
        calculateStreak(completed)
    }, [])
    
    const calculateStreak = (workouts: CompletedWorkout[]) => {
        if (workouts.length === 0) {
            setCurrentStreak(0)
            return
        }
        
        const sortedWorkouts = workouts
            .map(w => new Date(w.date))
            .sort((a, b) => b.getTime() - a.getTime())
        
        let streak = 1
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
        
        // Check if there's a workout today or yesterday
        const lastWorkout = sortedWorkouts[0]
        const daysDiff = Math.floor((currentDate.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff > 1) {
            setCurrentStreak(0)
            return
        }
        
        // Count consecutive days
        for (let i = 1; i < sortedWorkouts.length; i++) {
            const prevDate = sortedWorkouts[i - 1]
            const currDate = sortedWorkouts[i]
            const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
            
            if (diffDays === 1) {
                streak++
            } else {
                break
            }
        }
        
        setCurrentStreak(streak)
    }
    
    const getCalendarDays = () => {
        const year = selectedYear
        const month = selectedMonth
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const startDate = new Date(firstDay)
        startDate.setDate(startDate.getDate() - firstDay.getDay())
        
        const days = []
        const currentDate = new Date(startDate)
        
        while (currentDate <= lastDay || currentDate.getMonth() === month) {
            days.push(new Date(currentDate))
            currentDate.setDate(currentDate.getDate() + 1)
            if (days.length > 35) break // Prevent infinite loop
        }
        
        return days
    }
    
    const getWorkoutForDate = (date: Date) => {
        return completedWorkouts.find(workout => {
            const workoutDate = new Date(workout.date)
            return workoutDate.toDateString() === date.toDateString()
        })
    }
    
    const getMuscleGroupStats = () => {
        const stats: Record<MuscleGroup, number> = {} as Record<MuscleGroup, number>
        
        completedWorkouts.forEach(workout => {
            workout.muscleGroups.forEach(muscle => {
                stats[muscle] = (stats[muscle] || 0) + 1
            })
        })
        
        return Object.entries(stats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
    }
    
    const getTotalStats = () => {
        const totalWorkouts = completedWorkouts.length
        const totalExercises = completedWorkouts.reduce((sum, workout) => sum + workout.exercises, 0)
        const totalMinutes = completedWorkouts.reduce((sum, workout) => sum + workout.duration, 0)
        
        return { totalWorkouts, totalExercises, totalMinutes }
    }
    
    // const getMonthlyWorkouts = () => {
    //     const monthlyData: Record<string, number> = {}
        
    //     completedWorkouts.forEach(workout => {
    //         const date = new Date(workout.date)
    //         const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    //         monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
    //     })
        
    //     return monthlyData
    // }
    
    const stats = getTotalStats()
    const muscleStats = getMuscleGroupStats()
    const calendarDays = getCalendarDays()
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    const getMuscleGroupColor = (muscle: string) => {
        const colors: Record<string, string> = {
            quads: '#60a5fa', hamstrings: '#3b82f6', glutes: '#1d4ed8', calves: '#1e3a8a',
            chest: '#34d399', back: '#10b981', shoulders: '#059669', lats: '#047857', traps: '#065f46',
            biceps: '#fb923c', triceps: '#f97316', forearms: '#ea580c',
            core: '#ef4444'
        }
        return colors[muscle] || '#6b7280'
    }
    
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                    <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
                    <div className="text-sm opacity-90">Total Workouts</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                    <div className="text-2xl font-bold">{currentStreak}</div>
                    <div className="text-sm opacity-90">Day Streak</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                    <div className="text-2xl font-bold">{stats.totalExercises}</div>
                    <div className="text-sm opacity-90">Total Exercises</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                    <div className="text-2xl font-bold">{Math.round(stats.totalMinutes / 60)}h</div>
                    <div className="text-sm opacity-90">Time Trained</div>
                </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Workout Calendar</h3>
                        <div className="flex gap-2">
                            <select 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="px-2 py-1 border rounded text-sm"
                            >
                                {monthNames.map((month, index) => (
                                    <option key={index} value={index}>{month}</option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="px-2 py-1 border rounded text-sm"
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map(date => {
                            const workout = getWorkoutForDate(date)
                            const isCurrentMonth = date.getMonth() === selectedMonth
                            const isToday = date.toDateString() === new Date().toDateString()
                            
                            return (
                                <div
                                    key={date.toISOString()}
                                    className={`h-8 rounded flex items-center justify-center text-xs relative ${
                                        !isCurrentMonth 
                                            ? 'text-gray-300' 
                                            : isToday 
                                                ? 'bg-blue-100 text-blue-800 font-bold'
                                                : workout
                                                    ? 'bg-green-100 text-green-800 font-semibold'
                                                    : 'hover:bg-gray-50'
                                    }`}
                                    title={workout ? `Workout: ${workout.exercises} exercises, ${workout.duration} min` : undefined}
                                >
                                    {date.getDate()}
                                    {workout && (
                                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-100 rounded"></div>
                            <span>Workout Day</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-100 rounded"></div>
                            <span>Today</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border">
                    <h3 className="text-lg font-semibold mb-4">Muscle Group Frequency</h3>
                    {muscleStats.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No workout data available yet
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {muscleStats.map(([muscle, count]) => (
                                <div key={muscle} className="flex items-center">
                                    <div className="w-20 text-sm capitalize">{muscle}</div>
                                    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-3">
                                        <div 
                                            className="h-3 rounded-full transition-all duration-500"
                                            style={{ 
                                                width: `${(count / Math.max(...muscleStats.map(([, c]) => c))) * 100}%`,
                                                backgroundColor: getMuscleGroupColor(muscle)
                                            }}
                                        />
                                    </div>
                                    <div className="w-8 text-sm text-right font-semibold">{count}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {completedWorkouts.length > 0 && (
                <div className="bg-white rounded-lg p-4 border">
                    <h3 className="text-lg font-semibold mb-4">Recent Workouts</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {completedWorkouts
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 10)
                            .map((workout, index) => (
                                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                    <div>
                                        <div className="font-medium text-sm">
                                            {new Date(workout.date).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {workout.exercises} exercises • {workout.duration} min
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {workout.muscleGroups.slice(0, 3).map(muscle => (
                                            <span 
                                                key={muscle}
                                                className="px-2 py-0.5 text-xs rounded"
                                                style={{ 
                                                    backgroundColor: `${getMuscleGroupColor(muscle)}20`,
                                                    color: getMuscleGroupColor(muscle)
                                                }}
                                            >
                                                {muscle}
                                            </span>
                                        ))}
                                        {workout.muscleGroups.length > 3 && (
                                            <span className="text-xs text-gray-500">
                                                +{workout.muscleGroups.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
            
            {completedWorkouts.length === 0 && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4">🏋️</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Workouts Completed Yet</h3>
                    <p className="text-gray-600 mb-4">
                        Start building your workout routine and complete your first session to see your progress here.
                    </p>
                    <div className="text-sm text-gray-500">
                        Tip: Use the Live Workout timer to track your completed sessions
                    </div>
                </div>
            )}
        </div>
    )
}