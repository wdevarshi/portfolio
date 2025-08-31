'use client'

import WorkoutPlanner from '@/components/WorkoutPlanner'
import Link from 'next/link'

export default function WorkoutPlannerPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold">Workout Planner</h1>
                        <Link
                            href="/tools"
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            ← Back to Tools
                        </Link>
                    </div>
                    <WorkoutPlanner />
                </div>
            </div>
        </main>
    )
}