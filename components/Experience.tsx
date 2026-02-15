'use client'

import {useState, useEffect} from 'react'

interface ExperienceItem {
    title: string
    company: string
    period: string
    location: string
    description: string[]
    logo: string
}

const experienceData: ExperienceItem[] = [
    {
        title: "Head of Software Engineering",
        company: "Respiree",
        period: "Jan 2026 - Present",
        location: "Singapore",
        description: [
            "Leading engineering for a FDA-cleared remote patient monitoring platform",
            "Building the tech stack across NestJS backend, React dashboard, mobile app, and real-time data pipelines"
        ],
        logo: "/logos/respiree.png"
    },
    {
        title: "Lead Engineer",
        company: "BlueSG",
        period: "Jan 2025 - Dec 2025: 1 year",
        location: "Singapore",
        description: [
            "Delivered freemium tier implementation enabling broader user access",
            "Architected differentiated pricing strategies to optimize revenue streams"
        ],
        logo: "/logos/bluesg.svg"
    },
    {
        title: "Engineering Manager",
        company: "Carousell",
        period: "Feb 2021 - Dec 2024: 4 years",
        location: "Singapore",
        description: [
            "Developing and maintaining Carousell Ads Platform",
            "Leading technical initiatives and mentoring team members"
        ],
        logo: "/logos/carousell.png"
    },
    {
        title: "Software Engineer",
        company: "Goldman Sachs",
        period: "Dec 2018 - Jan 2021: 2 years",
        location: "Singapore",
        description: [
            "Developed an in-house rule engine for client onboarding",
            "Collaborated with diverse teams across the world to deliver projects",
        ],
        logo: "/logos/goldman-sachs.png"
    },
    {
        title: "Senior Software Engineer",
        company: "Carousell",
        period: "Feb 2017 - Dec 2018: 2 years",
        location: "Singapore",
        description: [
            "Working with highly available eventually consistent, distributed backend micro-service architecture",
            "Developed payments system for Carousell for ads platform"
        ],
        logo: "/logos/carousell.png"
    },
    {
        title: "Software Engineer",
        company: "Flipkart",
        period: "Jul 2015 - Feb 2017: 1 year 8 months",
        location: "Bengaluru Area, India",
        description: [
            "Built REST APIs using Spring, Dropwizard, and Hibernate",
            "Improved system performance and scalability",
            "Contributed to major e-commerce platform features"
        ],
        logo: "/logos/flipkart.png"
    }
]
export default function Experience() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <section id="experience" className="py-20">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Experience</h2>
                <div className="space-y-12">
                    {experienceData.map((exp, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                                <div className="flex items-center">
                                    <img src={exp.logo} alt={`${exp.company} logo`} className="w-12 h-12 mr-4"/>
                                    <div>
                                        <h3 className="text-xl font-semibold">{exp.title}</h3>
                                        <p className="text-gray-600">{exp.company}</p>
                                    </div>
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
    );
}