import Image from 'next/image'

export default function ProfilePhoto() {
    return (
        <section className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-48 h-48 rounded-full overflow-hidden relative">
                        <Image
                            src="/profilephoto.jpg"
                            alt="Devarshi Waghela"
                            width={200}
                            height={200}
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}