'use client'

import { useState, useEffect } from 'react'

interface ExperienceItem {
    title: string
    company: string
    period: string
    location: string
    description: string[]
}

const experienceData: ExperienceItem[] = [
    {
        title: "Senior Software Engineer",
        company: "Carousell",
        period: "Feb 2021 - Present",
        location: "Singapore",
        description: [
            "Working with highly available, distributed backend micro-service architecture",
            "Developing and maintaining Carousell Ads Platform",
            "Leading technical initiatives and mentoring team members"
        ]
    },
    {
        title: "Software Engineer",
        company: "Goldman Sachs",
        period: "Dec 2018 - Jan 2021",
        location: "Singapore",
        description: [
            "Developed and maintained financial technology solutions",
            "Worked with international teams on global projects",
            "Implemented high-performance trading systems"
        ]
    },
    {
        title: "Software Engineer",
        company: "Flipkart",
        period: "Jul 2015 - Feb 2017",
        location: "Bengaluru Area, India",
        description: [
            "Built REST APIs using Spring, Dropwizard, and Hibernate",
            "Improved system performance and scalability",
            "Contributed to major e-commerce platform features"
        ]
    }
]

export default function Experience() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <section id="experience" className="py-20">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Experience</h2>
                <div className="space-y-12">
                    {experienceData.map((exp, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                                    <p className="text-gray-600">{exp.company}</p>
                                </div>
                                <div className="text-gray-500 mt-2 md:mt-0">
                                    <p>{exp.period}</p>
                                    <p>{exp.location}</p>
                                </div>
                            </div>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                {exp.description.map((item, idx) => (
                                    <li key={idx} className="text-gray-600">{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}