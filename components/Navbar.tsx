export default function Navbar() {
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 font-bold text-xl">DW</div>
                    <div className="hidden md:flex space-x-8">
                        <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
                        <a href="#experience" className="text-gray-600 hover:text-gray-900">Experience</a>
                        <a href="#skills" className="text-gray-600 hover:text-gray-900">Skills</a>
                        <a href="#projects" className="text-gray-600 hover:text-gray-900">Projects</a>
                    </div>
                </div>
            </div>
        </nav>
    )
}