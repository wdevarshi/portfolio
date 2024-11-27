interface WinCardProps {
    title: string;
    description: string;
}

function WinCard({title, description}: WinCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}
