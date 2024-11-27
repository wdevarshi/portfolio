// components/Skills.tsx
const skills = {
    "Languages": ["Java", "Golang", "Python", "JavaScript/TypeScript"],
    "Technologies": ["Spring Boot", "Microservices", "Docker", "Kubernetes"],
    "Databases": ["MySQL", "MongoDB", "Redis", "PostgreSQL", "Kafka"],
    "Tools": ["Git", "Jenkins", "Linux", "AWS", "GCP"]
}

export default function Skills() {
    return (
        <section id="skills" className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Skills</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {Object.entries(skills).map(([category, items]) => (
                        <div key={category} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">{category}</h3>
                            <div className="flex flex-wrap gap-2">
                                {items.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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