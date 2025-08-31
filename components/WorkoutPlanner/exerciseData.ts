import { Exercise, WarmupExercise, CooldownExercise } from './types'

export const exerciseDatabase: Exercise[] = [
    // Strength Training - Legs
    {
        id: 'squat-001',
        name: 'Bodyweight Squat',
        category: 'strength',
        muscleGroups: ['quads', 'glutes', 'hamstrings'],
        difficulty: 2,
        equipment: ['none'],
        instructions: [
            'Stand with feet shoulder-width apart',
            'Lower your body by bending knees and hips',
            'Keep chest up and back straight',
            'Lower until thighs are parallel to ground',
            'Push through heels to return to start'
        ],
        sets: 3,
        reps: '12-15',
        tips: ['Keep knees aligned with toes', 'Engage core throughout'],
        commonMistakes: ['Knees caving inward', 'Heels lifting off ground'],
        variations: ['Jump squats', 'Pistol squats', 'Bulgarian split squats']
    },
    {
        id: 'lunge-001',
        name: 'Forward Lunges',
        category: 'strength',
        muscleGroups: ['quads', 'glutes', 'hamstrings'],
        difficulty: 2,
        equipment: ['none'],
        instructions: [
            'Stand with feet hip-width apart',
            'Step forward with one leg',
            'Lower hips until both knees are at 90 degrees',
            'Push back to starting position',
            'Alternate legs'
        ],
        sets: 3,
        reps: '10-12 each leg',
        tips: ['Keep torso upright', 'Don\'t let knee go past toes'],
        commonMistakes: ['Leaning forward', 'Short steps'],
        variations: ['Reverse lunges', 'Walking lunges', 'Lateral lunges']
    },
    {
        id: 'deadlift-001',
        name: 'Romanian Deadlift',
        category: 'strength',
        muscleGroups: ['hamstrings', 'glutes', 'back'],
        difficulty: 3,
        equipment: ['dumbbells', 'barbell'],
        instructions: [
            'Hold weights at hip level',
            'Keep knees slightly bent',
            'Hinge at hips, lowering weights',
            'Keep back straight and chest up',
            'Return to standing by driving hips forward'
        ],
        sets: 3,
        reps: '10-12',
        tips: ['Feel stretch in hamstrings', 'Keep weights close to body'],
        commonMistakes: ['Rounding back', 'Bending knees too much'],
        variations: ['Single-leg RDL', 'Sumo deadlift', 'Conventional deadlift']
    },
    
    // Strength Training - Upper Body
    {
        id: 'pushup-001',
        name: 'Push-ups',
        category: 'strength',
        muscleGroups: ['chest', 'triceps', 'shoulders'],
        difficulty: 2,
        equipment: ['none'],
        instructions: [
            'Start in plank position',
            'Lower body until chest nearly touches floor',
            'Push back up to starting position',
            'Keep body in straight line throughout'
        ],
        sets: 3,
        reps: '10-15',
        tips: ['Engage core', 'Control the descent'],
        commonMistakes: ['Sagging hips', 'Flaring elbows too wide'],
        variations: ['Incline push-ups', 'Diamond push-ups', 'Wide-grip push-ups']
    },
    {
        id: 'pullup-001',
        name: 'Pull-ups',
        category: 'strength',
        muscleGroups: ['back', 'lats', 'biceps'],
        difficulty: 4,
        equipment: ['pull-up-bar'],
        instructions: [
            'Hang from bar with overhand grip',
            'Pull body up until chin is over bar',
            'Lower with control to full arm extension'
        ],
        sets: 3,
        reps: '5-10',
        tips: ['Engage lats by pulling elbows down', 'Avoid swinging'],
        commonMistakes: ['Using momentum', 'Not going through full range'],
        variations: ['Chin-ups', 'Wide-grip pull-ups', 'Assisted pull-ups']
    },
    {
        id: 'row-001',
        name: 'Bent-Over Row',
        category: 'strength',
        muscleGroups: ['back', 'lats', 'biceps'],
        difficulty: 3,
        equipment: ['dumbbells', 'barbell'],
        instructions: [
            'Hinge at hips with slight knee bend',
            'Hold weights with arms extended',
            'Pull weights to lower chest/upper abdomen',
            'Squeeze shoulder blades together',
            'Lower with control'
        ],
        sets: 3,
        reps: '10-12',
        tips: ['Keep core tight', 'Drive elbows back, not out'],
        commonMistakes: ['Rounding back', 'Using momentum'],
        variations: ['Single-arm row', 'Inverted row', 'Cable row']
    },
    {
        id: 'press-001',
        name: 'Overhead Press',
        category: 'strength',
        muscleGroups: ['shoulders', 'triceps'],
        difficulty: 3,
        equipment: ['dumbbells', 'barbell'],
        instructions: [
            'Hold weights at shoulder height',
            'Press weights overhead until arms are extended',
            'Lower with control back to shoulders'
        ],
        sets: 3,
        reps: '10-12',
        tips: ['Keep core engaged', 'Don\'t arch back'],
        commonMistakes: ['Arching lower back', 'Pressing forward instead of up'],
        variations: ['Arnold press', 'Push press', 'Single-arm press']
    },
    
    // Core Exercises
    {
        id: 'plank-001',
        name: 'Plank',
        category: 'strength',
        muscleGroups: ['core'],
        difficulty: 2,
        equipment: ['none'],
        instructions: [
            'Start in forearm plank position',
            'Keep body in straight line from head to heels',
            'Engage core and hold position',
            'Breathe normally throughout'
        ],
        duration: 30,
        sets: 3,
        tips: ['Don\'t let hips sag or pike', 'Keep neck neutral'],
        commonMistakes: ['Holding breath', 'Sagging hips'],
        variations: ['Side plank', 'Plank with leg lifts', 'Mountain climbers']
    },
    {
        id: 'crunch-001',
        name: 'Bicycle Crunches',
        category: 'strength',
        muscleGroups: ['core'],
        difficulty: 2,
        equipment: ['none'],
        instructions: [
            'Lie on back with hands behind head',
            'Bring knees to 90 degrees',
            'Rotate torso, bringing elbow to opposite knee',
            'Extend other leg out',
            'Alternate sides in cycling motion'
        ],
        sets: 3,
        reps: '20-30',
        tips: ['Don\'t pull on neck', 'Focus on rotation'],
        commonMistakes: ['Pulling neck forward', 'Moving too fast'],
        variations: ['Russian twists', 'Regular crunches', 'Reverse crunches']
    },
    
    // Cardio Exercises
    {
        id: 'burpee-001',
        name: 'Burpees',
        category: 'cardio',
        muscleGroups: ['core', 'chest', 'quads', 'shoulders'],
        difficulty: 4,
        equipment: ['none'],
        instructions: [
            'Start standing',
            'Drop to squat position with hands on floor',
            'Jump feet back to plank position',
            'Perform a push-up',
            'Jump feet back to squat position',
            'Jump up with arms overhead'
        ],
        sets: 3,
        reps: '8-12',
        tips: ['Maintain steady pace', 'Land softly'],
        commonMistakes: ['Skipping the push-up', 'Not jumping at the end'],
        variations: ['Half burpees', 'Burpee box jumps', 'Burpee broad jumps']
    },
    {
        id: 'jumping-jack-001',
        name: 'Jumping Jacks',
        category: 'cardio',
        muscleGroups: ['calves', 'shoulders'],
        difficulty: 1,
        equipment: ['none'],
        instructions: [
            'Start with feet together, arms at sides',
            'Jump feet apart while raising arms overhead',
            'Jump back to starting position'
        ],
        duration: 45,
        sets: 3,
        tips: ['Land softly on balls of feet', 'Keep core engaged'],
        commonMistakes: ['Landing hard', 'Not fully extending arms'],
        variations: ['Star jumps', 'Cross jacks', 'Squat jacks']
    },
    {
        id: 'mountain-climber-001',
        name: 'Mountain Climbers',
        category: 'cardio',
        muscleGroups: ['core', 'shoulders', 'quads'],
        difficulty: 3,
        equipment: ['none'],
        instructions: [
            'Start in plank position',
            'Drive one knee toward chest',
            'Quickly switch legs',
            'Continue alternating in running motion'
        ],
        duration: 30,
        sets: 3,
        tips: ['Keep hips level', 'Maintain plank position'],
        commonMistakes: ['Bouncing hips', 'Losing plank form'],
        variations: ['Cross-body mountain climbers', 'Slow mountain climbers']
    },
    
    // Flexibility Exercises
    {
        id: 'stretch-hamstring-001',
        name: 'Standing Hamstring Stretch',
        category: 'flexibility',
        muscleGroups: ['hamstrings'],
        difficulty: 1,
        equipment: ['none'],
        instructions: [
            'Place one foot slightly forward',
            'Hinge at hips, reaching toward toes',
            'Keep back straight',
            'Hold for 30 seconds',
            'Switch legs'
        ],
        duration: 30,
        sets: 2,
        tips: ['Don\'t bounce', 'Breathe deeply'],
        commonMistakes: ['Rounding back', 'Forcing the stretch'],
        variations: ['Seated hamstring stretch', 'Lying hamstring stretch']
    },
    {
        id: 'stretch-quad-001',
        name: 'Standing Quad Stretch',
        category: 'flexibility',
        muscleGroups: ['quads'],
        difficulty: 1,
        equipment: ['none'],
        instructions: [
            'Stand on one leg',
            'Pull other foot toward glutes',
            'Keep knees together',
            'Hold for 30 seconds',
            'Switch legs'
        ],
        duration: 30,
        sets: 2,
        tips: ['Use wall for balance if needed', 'Keep torso upright'],
        commonMistakes: ['Arching back', 'Letting knee drift out'],
        variations: ['Lying quad stretch', 'Kneeling hip flexor stretch']
    },
    {
        id: 'yoga-child-001',
        name: 'Child\'s Pose',
        category: 'flexibility',
        muscleGroups: ['back', 'shoulders'],
        difficulty: 1,
        equipment: ['none'],
        instructions: [
            'Kneel on floor',
            'Sit back on heels',
            'Fold forward with arms extended',
            'Rest forehead on ground',
            'Hold and breathe deeply'
        ],
        duration: 60,
        sets: 1,
        tips: ['Relax shoulders', 'Focus on breathing'],
        commonMistakes: ['Tensing shoulders', 'Not sitting back fully'],
        variations: ['Wide-knee child\'s pose', 'Thread the needle']
    }
]

export const warmupExercises: WarmupExercise[] = [
    {
        name: 'Arm Circles',
        duration: 30,
        instructions: 'Make large circles with arms, forward then backward',
        targetMuscles: ['shoulders']
    },
    {
        name: 'Leg Swings',
        duration: 30,
        instructions: 'Swing leg forward and back, then side to side',
        targetMuscles: ['hamstrings', 'quads', 'glutes']
    },
    {
        name: 'High Knees',
        duration: 30,
        instructions: 'Jog in place bringing knees up high',
        targetMuscles: ['quads', 'core']
    },
    {
        name: 'Butt Kicks',
        duration: 30,
        instructions: 'Jog in place kicking heels to glutes',
        targetMuscles: ['hamstrings', 'quads']
    },
    {
        name: 'Torso Twists',
        duration: 30,
        instructions: 'Rotate torso side to side with arms extended',
        targetMuscles: ['core', 'back']
    },
    {
        name: 'Walking Lunges',
        duration: 45,
        instructions: 'Perform lunges while walking forward',
        targetMuscles: ['quads', 'glutes', 'hamstrings']
    },
    {
        name: 'Shoulder Rolls',
        duration: 20,
        instructions: 'Roll shoulders forward then backward',
        targetMuscles: ['shoulders', 'traps']
    },
    {
        name: 'Hip Circles',
        duration: 30,
        instructions: 'Circle hips in both directions',
        targetMuscles: ['core', 'glutes']
    }
]

export const cooldownExercises: CooldownExercise[] = [
    {
        name: 'Forward Fold',
        duration: 45,
        instructions: 'Stand and fold forward, reaching for toes',
        targetMuscles: ['hamstrings', 'back']
    },
    {
        name: 'Seated Spinal Twist',
        duration: 30,
        instructions: 'Sit and twist torso to each side',
        targetMuscles: ['back', 'core']
    },
    {
        name: 'Butterfly Stretch',
        duration: 45,
        instructions: 'Sit with soles of feet together, press knees down',
        targetMuscles: ['glutes', 'hamstrings']
    },
    {
        name: 'Cat-Cow Stretch',
        duration: 45,
        instructions: 'On hands and knees, arch and round back',
        targetMuscles: ['back', 'core']
    },
    {
        name: 'Shoulder Stretch',
        duration: 30,
        instructions: 'Pull arm across body and hold',
        targetMuscles: ['shoulders']
    },
    {
        name: 'Tricep Stretch',
        duration: 30,
        instructions: 'Reach arm overhead and pull elbow with other hand',
        targetMuscles: ['triceps']
    },
    {
        name: 'Calf Stretch',
        duration: 30,
        instructions: 'Step back and press heel to ground',
        targetMuscles: ['calves']
    },
    {
        name: 'Deep Breathing',
        duration: 60,
        instructions: 'Lie down and take deep, slow breaths',
        targetMuscles: ['core']
    }
]