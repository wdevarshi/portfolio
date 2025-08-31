import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Exercise } from './types'
import { warmupExercises, cooldownExercises } from './exerciseData'

interface LiveWorkoutTimerProps {
    workoutPlan: Exercise[]
    restTime: number
    includeWarmup: boolean
    includeCooldown: boolean
    onComplete: () => void
}

type WorkoutPhase = 'warmup' | 'main' | 'cooldown' | 'completed'
type TimerState = 'exercise' | 'rest' | 'paused' | 'get-ready'

export default function LiveWorkoutTimer({ 
    workoutPlan, 
    restTime, 
    includeWarmup, 
    includeCooldown, 
    onComplete 
}: LiveWorkoutTimerProps) {
    const [currentPhase, setCurrentPhase] = useState<WorkoutPhase>(includeWarmup ? 'warmup' : 'main')
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
    const [currentSet, setCurrentSet] = useState(1)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [timerState, setTimerState] = useState<TimerState>('paused')
    const [isStarted, setIsStarted] = useState(false)
    const [totalElapsedTime, setTotalElapsedTime] = useState(0)
    const [waterBreakCount, setWaterBreakCount] = useState(0)
    const [lastWaterBreak, setLastWaterBreak] = useState(0)
    
    const intervalRef = useRef<NodeJS.Timeout>()
    const audioContextRef = useRef<AudioContext>()
    
    const warmupList = includeWarmup ? warmupExercises.slice(0, 5) : []
    const cooldownList = includeCooldown ? cooldownExercises.slice(0, 5) : []
    
    const getCurrentExercise = () => {
        switch (currentPhase) {
            case 'warmup':
                return warmupList[currentExerciseIndex]
            case 'main':
                return workoutPlan[currentExerciseIndex]
            case 'cooldown':
                return cooldownList[currentExerciseIndex]
            default:
                return null
        }
    }
    
    const getCurrentExerciseName = () => {
        const exercise = getCurrentExercise()
        if (currentPhase === 'warmup' || currentPhase === 'cooldown') {
            return exercise?.name || ''
        }
        return exercise?.name || ''
    }
    
    const playBeep = useCallback((frequency: number = 800, duration: number = 200, type: 'single' | 'double' | 'triple' = 'single') => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        }
        
        const ctx = audioContextRef.current
        const beepCount = type === 'single' ? 1 : type === 'double' ? 2 : 3
        
        for (let i = 0; i < beepCount; i++) {
            setTimeout(() => {
                const oscillator = ctx.createOscillator()
                const gainNode = ctx.createGain()
                
                oscillator.connect(gainNode)
                gainNode.connect(ctx.destination)
                
                oscillator.frequency.value = frequency
                oscillator.type = 'sine'
                
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000)
                
                oscillator.start(ctx.currentTime)
                oscillator.stop(ctx.currentTime + duration / 1000)
            }, i * (duration + 100))
        }
    }, [])
    
    const speakText = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.rate = 0.9
            utterance.pitch = 1
            utterance.volume = 0.8
            speechSynthesis.speak(utterance)
        }
    }, [])
    
    useEffect(() => {
        if (timerState === 'exercise' || timerState === 'rest' || timerState === 'get-ready') {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleTimerComplete()
                        return 0
                    }
                    
                    // Audio cues
                    if (prev === 4) {
                        playBeep(600, 150, 'single')
                    } else if (prev === 3) {
                        playBeep(700, 150, 'single')
                        speakText('3')
                    } else if (prev === 2) {
                        playBeep(800, 150, 'single')
                        speakText('2')
                    } else if (prev === 1) {
                        playBeep(900, 200, 'single')
                        speakText('1')
                    }
                    
                    return prev - 1
                })
                setTotalElapsedTime(prev => prev + 1)
                
                // Water break reminder every 15 minutes
                if (totalElapsedTime > 0 && totalElapsedTime % 900 === 0 && totalElapsedTime - lastWaterBreak >= 900) {
                    setWaterBreakCount(prev => prev + 1)
                    setLastWaterBreak(totalElapsedTime)
                    speakText('Time for a water break!')
                }
            }, 1000)
        }
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [timerState, totalElapsedTime, lastWaterBreak, playBeep, speakText])
    
    const handleTimerComplete = () => {
        if (timerState === 'get-ready') {
            startExercise()
        } else if (timerState === 'exercise') {
            if (currentPhase === 'main' && currentSet < ((getCurrentExercise() as Exercise)?.sets || 3)) {
                startRest()
            } else {
                moveToNextExercise()
            }
        } else if (timerState === 'rest') {
            setCurrentSet(prev => prev + 1)
            startGetReady()
        }
    }
    
    const startGetReady = () => {
        setTimerState('get-ready')
        setTimeRemaining(5)
        playBeep(500, 300, 'double')
        speakText(`Get ready for ${getCurrentExerciseName()}`)
    }
    
    const startExercise = () => {
        const exercise = getCurrentExercise()
        setTimerState('exercise')
        
        if (currentPhase === 'warmup' || currentPhase === 'cooldown') {
            setTimeRemaining((exercise as { duration?: number })?.duration || 30)
        } else {
            setTimeRemaining(45) // Default 45 seconds per set for main exercises
        }
        
        playBeep(800, 400, 'triple')
        speakText(`${getCurrentExerciseName()}, set ${currentSet}`)
    }
    
    const startRest = () => {
        setTimerState('rest')
        setTimeRemaining(restTime)
        playBeep(400, 200, 'single')
        speakText(`Rest time, ${restTime} seconds`)
    }
    
    const moveToNextExercise = () => {
        const exerciseList = currentPhase === 'warmup' ? warmupList : 
                           currentPhase === 'main' ? workoutPlan : cooldownList
        
        if (currentExerciseIndex < exerciseList.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1)
            setCurrentSet(1)
            startGetReady()
        } else {
            moveToNextPhase()
        }
    }
    
    const moveToNextPhase = () => {
        if (currentPhase === 'warmup') {
            setCurrentPhase('main')
            setCurrentExerciseIndex(0)
            setCurrentSet(1)
            speakText('Warmup complete! Starting main workout')
            startGetReady()
        } else if (currentPhase === 'main') {
            if (includeCooldown) {
                setCurrentPhase('cooldown')
                setCurrentExerciseIndex(0)
                setCurrentSet(1)
                speakText('Main workout complete! Starting cooldown')
                startGetReady()
            } else {
                completeWorkout()
            }
        } else if (currentPhase === 'cooldown') {
            completeWorkout()
        }
    }
    
    const completeWorkout = () => {
        setCurrentPhase('completed')
        setTimerState('paused')
        playBeep(600, 500, 'triple')
        speakText('Workout complete! Great job!')
        onComplete()
    }
    
    const startWorkout = () => {
        setIsStarted(true)
        if (includeWarmup) {
            speakText('Starting warmup')
        } else {
            speakText('Starting workout')
        }
        startGetReady()
    }
    
    const togglePause = () => {
        if (timerState === 'paused') {
            setTimerState('exercise')
            speakText('Resuming')
        } else {
            setTimerState('paused')
            speakText('Paused')
        }
    }
    
    const skipExercise = () => {
        moveToNextExercise()
    }
    
    const skipSet = () => {
        if (currentPhase === 'main' && currentSet < ((getCurrentExercise() as Exercise)?.sets || 3)) {
            startRest()
        } else {
            moveToNextExercise()
        }
    }
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    
    const getProgress = () => {
        let totalExercises = 0
        let completedExercises = 0
        
        if (includeWarmup) {
            totalExercises += warmupList.length
            if (currentPhase === 'warmup') {
                completedExercises += currentExerciseIndex
            } else {
                completedExercises += warmupList.length
            }
        }
        
        totalExercises += workoutPlan.length
        if (currentPhase === 'main') {
            completedExercises += currentExerciseIndex
        } else if (currentPhase === 'cooldown' || currentPhase === 'completed') {
            completedExercises += workoutPlan.length
        }
        
        if (includeCooldown) {
            totalExercises += cooldownList.length
            if (currentPhase === 'cooldown') {
                completedExercises += currentExerciseIndex
            } else if (currentPhase === 'completed') {
                completedExercises += cooldownList.length
            }
        }
        
        return { completed: completedExercises, total: totalExercises }
    }
    
    const progress = getProgress()
    
    if (currentPhase === 'completed') {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-4">Workout Complete!</h2>
                <div className="text-lg text-gray-600 mb-8">
                    Total time: {formatTime(totalElapsedTime)}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                    <p>Exercises completed: {progress.total}</p>
                    <p>Water breaks taken: {waterBreakCount}</p>
                </div>
            </div>
        )
    }
    
    if (!isStarted) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-6">Ready to Start Your Workout?</h2>
                <div className="mb-8 space-y-2 text-gray-600">
                    {includeWarmup && <p>✓ Warmup included ({warmupList.length} exercises)</p>}
                    <p>✓ Main workout ({workoutPlan.length} exercises)</p>
                    {includeCooldown && <p>✓ Cooldown included ({cooldownList.length} exercises)</p>}
                </div>
                <button
                    onClick={startWorkout}
                    className="px-8 py-4 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-green-700"
                >
                    Start Workout
                </button>
            </div>
        )
    }
    
    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
                <div className="bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                    />
                </div>
                <div className="text-sm text-gray-600">
                    {progress.completed} of {progress.total} exercises
                </div>
            </div>
            
            <div className="text-center">
                <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                    {currentPhase} {currentPhase === 'main' && `• Set ${currentSet}`}
                </div>
                <h2 className="text-2xl font-bold mb-4">{getCurrentExerciseName()}</h2>
                
                {timerState === 'get-ready' && (
                    <div className="text-orange-600 font-semibold mb-4">Get Ready!</div>
                )}
                
                <div className={`text-6xl font-bold mb-4 ${
                    timerState === 'exercise' ? 'text-green-600' :
                    timerState === 'rest' ? 'text-blue-600' :
                    timerState === 'get-ready' ? 'text-orange-600' : 'text-gray-400'
                }`}>
                    {formatTime(timeRemaining)}
                </div>
                
                <div className="text-sm text-gray-600">
                    {timerState === 'exercise' && 'Exercise Time'}
                    {timerState === 'rest' && 'Rest Time'}
                    {timerState === 'get-ready' && 'Get Ready'}
                    {timerState === 'paused' && 'Paused'}
                </div>
            </div>
            
            <div className="flex gap-3 justify-center">
                <button
                    onClick={togglePause}
                    className={`px-6 py-3 rounded-lg font-semibold ${
                        timerState === 'paused'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                >
                    {timerState === 'paused' ? 'Resume' : 'Pause'}
                </button>
                
                {currentPhase === 'main' && (
                    <button
                        onClick={skipSet}
                        className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Skip Set
                    </button>
                )}
                
                <button
                    onClick={skipExercise}
                    className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                    Skip Exercise
                </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="flex justify-between items-center mb-2">
                    <span>Total Time:</span>
                    <span className="font-semibold">{formatTime(totalElapsedTime)}</span>
                </div>
                {waterBreakCount > 0 && (
                    <div className="flex justify-between items-center">
                        <span>Water Breaks:</span>
                        <span className="font-semibold">{waterBreakCount}</span>
                    </div>
                )}
            </div>
            
            {getCurrentExercise() && currentPhase === 'main' && (
                <div className="bg-blue-50 rounded-lg p-4 text-sm">
                    <h4 className="font-semibold mb-2">Exercise Instructions:</h4>
                    <ol className="space-y-1">
                        {(getCurrentExercise() as Exercise)?.instructions?.slice(0, 3).map((instruction, i) => (
                            <li key={i} className="flex">
                                <span className="mr-2">{i + 1}.</span>
                                <span>{instruction}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    )
}