export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'mixed'

export type MuscleGroup = 
    | 'quads' 
    | 'hamstrings' 
    | 'glutes' 
    | 'calves' 
    | 'core' 
    | 'back' 
    | 'chest' 
    | 'shoulders' 
    | 'biceps' 
    | 'triceps'
    | 'forearms'
    | 'neck'
    | 'lats'
    | 'traps'

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'

export type Equipment = 
    | 'none' 
    | 'dumbbells' 
    | 'barbell'
    | 'resistance-bands' 
    | 'kettlebell'
    | 'pull-up-bar'
    | 'cables'
    | 'machine'
    | 'full-gym'

export interface Exercise {
    id: string
    name: string
    category: WorkoutType
    muscleGroups: MuscleGroup[]
    difficulty: number // 1-5
    equipment: Equipment[]
    instructions: string[]
    sets?: number
    reps?: string
    duration?: number // in seconds
    restTime?: number // in seconds
    videoUrl?: string
    imageUrl?: string
    tips?: string[]
    commonMistakes?: string[]
    variations?: string[]
}

export interface WorkoutPlan {
    id: string
    name: string
    category: string
    exercises: Exercise[]
    duration: number
    equipment: Equipment[]
    muscleGroups: MuscleGroup[]
    experienceLevel: ExperienceLevel
    createdAt: string
    includeWarmup: boolean
    includeCooldown: boolean
}

export interface CompletedWorkout {
    date: string
    exercises: number
    duration: number
    muscleGroups: MuscleGroup[]
}

export interface WarmupExercise {
    name: string
    duration: number
    instructions: string
    targetMuscles: MuscleGroup[]
}

export interface CooldownExercise {
    name: string
    duration: number
    instructions: string
    targetMuscles: MuscleGroup[]
}