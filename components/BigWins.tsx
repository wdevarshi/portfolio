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

interface SideProject {
    title: string
    description: string
    stack: string
    href: string
    linkLabel: string
}

const sideProjects: SideProject[] = [
    {
        title: "DirectBus",
        description:
            "Find a home in Singapore with one bus to your office. Pick where you work and it maps every premium, City Direct and ShareTransport bus that runs there, with pickup times, fares, ride times and rentals near each stop. Built end to end: data pipeline from LTA's route files and DataMall refreshed weekly, server-rendered pages for every bus, office area and neighbourhood, and product analytics.",
        stack: "Go · Postgres · Leaflet · Vercel",
        href: "https://directbus.sg",
        linkLabel: "directbus.sg",
    },
]

function SideProjectCard({ title, description, stack, href, linkLabel }: SideProject) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener"
            className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
        >
            <div className="flex items-baseline justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <span className="text-sm text-gray-500 whitespace-nowrap">{linkLabel} ↗</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{description}</p>
            <p className="text-xs text-gray-500">{stack}</p>
        </a>
    )
}

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
                <h3 className="text-xl font-semibold mt-14 mb-6 text-gray-900">
                    Side projects
                </h3>
                <div className="grid gap-6">
                    {sideProjects.map((project) => (
                        <SideProjectCard key={project.title} {...project} />
                    ))}
                </div>
            </div>
        </section>
    )
}
