import Navbar from "@/components/navbar";

type Certificate = {
    title: string;
    description: string;
    image: string;
    issued?: string;
    credentialUrl?: string;
};

const certificates: Certificate[] = [
    {
        title: "The AI Engineer Path",
        description: "A 114-hour, 258-lesson learning path focused on building practical AI-powered applications.",
        image: "/certificates/ai-engineer.jpg",
        issued: "July 8, 2026",
        credentialUrl: "/certificates/ai-engineer.pdf",
    },
    {
        title: "Learn React",
        description: "A 15.1-hour, 357-lesson course covering modern React fundamentals and application development.",
        image: "/certificates/react.jpg",
        issued: "March 24, 2026",
        credentialUrl: "/certificates/react.pdf",
    },
    {
        title: "Learn AI Agents",
        description: "A 31-lesson course focused on creating AI agents and understanding agent-based workflows.",
        image: "/certificates/ai-agents.jpg",
        issued: "July 8, 2026",
        credentialUrl: "/certificates/ai-agents.pdf",
    },
    {
        title: "Learn Context Engineering",
        description: "A 15-lesson course covering the design and management of effective context for AI systems.",
        image: "/certificates/context-engineering.jpg",
        issued: "July 8, 2026",
        credentialUrl: "/certificates/context-engineering.pdf",
    },
];

export default function Certificates() {
    return (
        <main className="min-h-screen bg-gray-900 px-6 py-16 text-white">
            <Navbar />

            <section className="mx-auto mt-12 max-w-6xl">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                        Continued learning
                    </p>
                    <h1 className="text-4xl font-bold sm:text-5xl">
                        Scrimba Certificates
                    </h1>
                    <p className="mt-5 text-lg leading-8 text-gray-300">
                        A collection of the courses and learning paths I have completed
                        while sharpening my frontend, full-stack, and AI engineering skills.
                    </p>
                    <aside className="mx-auto mt-6 max-w-2xl rounded-lg border border-blue-400/40 bg-blue-500/10 px-5 py-4 text-left text-gray-200">
                        <p>
                            <span className="font-semibold text-blue-300">A quick note:</span>{" "}
                            I sometimes go by Isaac, so some of my certificates are issued
                            under that name.
                        </p>
                    </aside>
                </div>

                {certificates.length > 0 ? (
                    <div className="mt-12 grid gap-8 md:grid-cols-2">
                        {certificates.map((certificate) => (
                            <article
                                key={certificate.title}
                                className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-blue-400"
                            >
                                <img
                                    src={certificate.image}
                                    alt={`${certificate.title} certificate`}
                                    className="aspect-[16/10] w-full bg-gray-950 object-contain"
                                />
                                <div className="p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <h2 className="text-2xl font-bold text-blue-400">
                                            {certificate.title}
                                        </h2>
                                        {certificate.issued && (
                                            <span className="rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-200">
                                                {certificate.issued}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-4 leading-7 text-gray-300">
                                        {certificate.description}
                                    </p>
                                    {certificate.credentialUrl && (
                                        <a
                                            href={certificate.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            View credential
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-dashed border-gray-600 bg-gray-800 p-10 text-center shadow-lg">
                        <div
                            aria-hidden="true"
                            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/15 text-2xl text-blue-400"
                        >
                            Award
                        </div>
                        <h2 className="mt-5 text-2xl font-bold">Certificates coming soon</h2>
                        <p className="mt-3 leading-7 text-gray-300">
                            I&apos;m preparing my Scrimba certificates and verified
                            credential links for this collection.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}
