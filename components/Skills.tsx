const skills: Record<string, string[]> = {
    Languages: ["Java", "Golang", "Python", "JavaScript/TypeScript"],
    Technologies: ["Spring Boot", "Microservices", "Docker", "Kubernetes", "NestJS"],
    Databases: ["MySQL", "MongoDB", "Redis", "PostgreSQL", "Kafka"],
    Tools: ["Git", "Jenkins", "Linux", "AWS", "GCP"],
}

export default function Skills() {
    return (
        <section id="skills" className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
                    Skills
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {Object.entries(skills).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                {category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {items.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
