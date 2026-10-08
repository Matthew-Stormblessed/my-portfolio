import { ChatMessage } from "@/app/types"
import { useState } from 'react'



export default function MessageSources({ m }: { m: ChatMessage }) {
    const [isOpen, setIsOpen] = useState(false)
    return (

        m.metadata?.sources && m.metadata.sources.length > 0 &&
        <>
            <button
                type="button"
                onClick={() => { setIsOpen(prev => !prev) }}
                className="mt-2 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70 transition-colors duration-150 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
                Sources {isOpen ? "▲" : "▼"}
            </button>
            {isOpen && (
                <ul className="mt-2 flex flex-col gap-1.5 rounded-lg border border-white/10 bg-[#0f0f0f] px-3 py-2">
                    {m.metadata?.sources?.map(source =>
                        source.url ? (
                            <li key={source.id}>
                                <a
                                    className="text-xs text-[var(--color-accent)] hover:underline"
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {source.title}
                                </a>
                            </li>
                        ) : (
                            <li key={source.id} className="text-xs text-white/60">
                                {source.title}
                            </li>
                        )
                    )}
                </ul>
            )}
        </>



    )
}