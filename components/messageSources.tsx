import { ChatMessage } from "@/app/types"
import { useState } from 'react'



export default function MessageSources({ m }: { m: ChatMessage }) {
    const [isOpen, setIsOpen] = useState(false)
    return (

        m.metadata?.sources && m.metadata.sources.length > 0 &&
        <>
            <div onClick={() => { setIsOpen(prev => !prev) }} className='w-25 mt-1 p-1 bg-emerald-900 rounded-2xl flex flex-col items-center justify-center'>
                Sources ▼
            </div>
            <li className='flex flex-col gap-1'>
                {isOpen &&
                    m.metadata?.sources?.map(source =>
                        source.url ?
                        <a className={`text-[11px] hover:underline`} key={source.id} href={source.url}>
                            {source.title}
                        </a>
                        :
                        <span key={source.id}>{source.title}</span>
                    )
                }
            </li>
        </>



    )
}