"use client";
import { useEffect, useState, useRef } from 'react';
import sendSVG from '@/public/send.svg';
import aiSVG from '@/public/robot-ai-svgrepo-com.svg'
import Image from 'next/image';
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "motion/react"
import { ChatMessage } from '@/app/types';
import MessageSources from './messageSources';

export default function AiAssistant() {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [inputError, setInputError] = useState("");
    const [storedConvo, setStoredConvo] = useState<ChatMessage[]>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("aiconvo");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.expiry && parsed.expiry > Date.now()) {
                    return parsed.messages;
                }
            }
        }
        return [{ id: "welcome_message", role: "assistant", parts: [{ type: "text", text: "Hi! I'm Matthew's AI assistant. I can answer questions about his experience, explain how his projects work, and help you determine whether he's a good fit for your team." }] }];
    });

    const {
        messages,
        sendMessage,
        setMessages,
        status,
        error,
        stop,
        clearError,
    } = useChat<ChatMessage>({
        transport: new DefaultChatTransport({
            api: "/api/chat",
        }),
        messages: storedConvo,
        onError(err) {
            setInputError(err.message);
        }
    });

    useEffect(() => {
        if (bottomRef.current)
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });


    }, [status]);

    useEffect(() => {
        // expiry is set to 24 hours from now
        if (messages.length > 0 && status === "ready") {
            localStorage.setItem("aiconvo", JSON.stringify({ messages, expiry: Date.now() + 1000 * 60 * 60 * 24 }));
        }

    }, [status]);

    useEffect(() => {

    }, []);

    async function SendInput(value?: string) {
        clearError();
        setInputError("");
        if ((inputValue.trim() === "" && !value) || status !== "ready") return;
        if (inputValue.length > 1000) {
            setInputValue("");
            setInputError("Please keep questions under 1000 characters");
            return;
        }
        setInputValue("");
        setInputError("");

        if (value) {
            await sendMessage({ text: value });
            return;
        }
        await sendMessage({ text: inputValue })


    }

    return (
        <div className='bg-gray-900 h-[90vh] mt-5 flex flex-col'>
            <button className="bg-blue-500 max-w-30 w-full mx-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2" onClick={() => {
                localStorage.removeItem("aiconvo");
                setMessages([{ id: "welcome_message", role: "assistant", parts: [{ type: "text", text: "Hi! I'm Matthew's AI assistant. I can answer questions about his experience, explain how his projects work, and help you determine whether he's a good fit for your team." }] }]);

            }}>
                New chat
            </button>
            <div className="overflow-auto scrollbar-none w-full p-4">
                {messages.map((m, index) => {

                    if (index !== messages.length - 1 || m.role !== "assistant") {

                        return (
                            <div className='flex flex-row gap-2' key={index}>

                                {m.role === "assistant" &&
                                    <Image src={aiSVG} width={30} height={30} alt="send button svg" />
                                }
                                <div className={`flex flex-col ${m.role === 'assistant' ? "" : "ml-auto"
                                    }`}>
                                    <div key={index} className={`${m.role === "assistant" ? "bg-[#2A2A2E] w-full max-w-full min-w-0" : "bg-blue-700 ml-auto w-fit max-w-100"} rounded-2xl p-2 mt-3 text-left prose prose-invert max-w-none text-white`}>{m.parts.map((part, partIndex) => {
                                        if (part.type !== "text") {
                                            return null;
                                        }

                                        return <ReactMarkdown key={partIndex} remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
                                    })}
                                    </div>
                                    <MessageSources m={m} />
                                </div>

                            </div>
                        )
                    }

                    else if (m.role === "assistant" && (status === "ready" || status === "streaming") && m.parts.filter(m => m.type === "text").length > 0) {
                        return (

                            <div className='flex flex-row gap-2' key={index}>

                                <Image src={aiSVG} width={30} height={30} alt="send button svg" />

                                <div className='flex flex-col'>
                                    <div className={`bg-[#2A2A2E] w-full max-w-full min-w-0 rounded-2xl p-2 mt-3 text-left prose prose-invert text-white`}>{m.parts.map((part, partIndex) => {
                                        if (part.type !== "text") {
                                            return null;
                                        }

                                        return <ReactMarkdown key={partIndex} remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
                                    })}
                                    </div>

                                    <MessageSources m={m} />

                                </div>
                            </div>

                        )
                    }
                })
                }

                <div ref={bottomRef}></div>
            </div>
            {status !== "ready" && !error ?
                <div className='flex flex-row gap-2 ml-4'>
                    <Image src={aiSVG} width={30} height={30} alt="send button svg" />
                    <div className='text-left bg-[#2A2A2E] flex flex-row w-8 gap-1 rounded-2xl items-center justify-center'>

                        <div className='animate-bounce [animation-delay:0ms]'>.</div>
                        <div className='animate-bounce [animation-delay:150ms]'>.</div>
                        <div className='animate-bounce [animation-delay:300ms]'>.</div>
                    </div>
                </div> : ""}
            <div className='mt-2'></div>

            <div className='flex flex-col text-[18px] gap-2 mt-auto items-center w-full justify-center'>
                {status === 'ready' &&
                    <div className="flex flex-row text-[18px] my-4 gap-2">
                        <motion.button onClick={() => {
                            setInputValue("What education does Matthew have?")
                            SendInput("What education does Matthew have?")
                        }} whileHover={{ scale: 1.05, borderColor: "rgb(34, 197, 188)" }} className='bg-blue-800 hover: scale-3d rounded-2xl p-1 border-4'>What education does Matthew have?</motion.button>
                        <motion.button onClick={() => {
                            setInputValue("What is Matthew's work experience?")
                            SendInput("What is Matthew's work experience?")
                        }} whileHover={{ scale: 1.05, borderColor: "rgb(34, 197, 188)" }} className='bg-blue-800 hover: scale-3d rounded-2xl p-1 border-4'>What is Matthew's work experience?</motion.button>
                        <motion.button onClick={() => {
                            setInputValue("What technologies is Matthew proficient in?")
                            SendInput("What technologies is Matthew proficient in?");
                        }} whileHover={{ scale: 1.05, borderColor: "rgb(34, 197, 188)" }} className='bg-blue-800 hover: scale-3d rounded-2xl p-1 border-4'>What technologies is Matthew proficient in?</motion.button>
                    </div>
                }
                <div className=' max-w-200 w-full flex flex-row bg-amber-800 rounded-2xl h-fit min-h-10 p-3'>
                    <textarea onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            SendInput();
                        }
                    }} className='w-full outline-none text-wrap scrollbar-none field-sizing-content resize-none' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    <button className='flex flex-col items-center justify-center' onClick={(e) => {
                        SendInput();
                    }}>
                        <Image src={sendSVG} width={30} height={30} alt="send button svg" />
                    </button>
                </div>
                <div className={`${inputError ? 'mt-2' : ''} text-red-600`}>{inputError}</div>
            </div>

        </div>
    )
}
