interface WinCard {
    title: string;
    description: string;
}

const wins: WinCard[] = [
    {
        title: "Payment Service",
        description: "Architected and implemented a scalable payment service, enabling seamless transactions for millions of transactions on the Carousell platform."
    },
    {
        title: "Ads Service",
        description: "Developed a green field advertising service that optimized ad delivery and significantly increased platform revenue through targeted campaigns."
    },
    {
        title: "Pricing Service",
        description: "Built a highly scalable pricing service"
    }
];

function WinCard({ title, description }: WinCard) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}

export default function BigWins() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Big Wins</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {wins.map((win, index) => (
                        <WinCard key={index} {...win} />
                    ))}
                </div>
            </div>
        </section>
    )
}