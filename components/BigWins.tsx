interface ProjectCard {
    title: string
    description: string
}

const projects: ProjectCard[] = [
    {
        title: "Payment and Fulfilment Service",
        description:
            "Architected and implemented a scalable payment service, enabling seamless transactions for millions of transactions on the Carousell platform.",
    },
    {
        title: "Ads Service",
        description:
            "Developed a green field advertising service that optimized ad delivery and significantly increased platform revenue through targeted campaigns.",
    },
    {
        title: "Pricing Service",
        description:
            "Developed a highly scalable, rule-based pricing engine that enabled seamless price adjustments for operations, leading to a significant revenue boost from various pricing experiments.",
    },
]

function Card({ title, description }: ProjectCard) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
    )
}

export default function BigWins() {
    return (
        <section id="projects" className="py-20">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
                    Projects
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <Card key={index} {...project} />
                    ))}
                </div>
            </div>
        </section>
    )
}
