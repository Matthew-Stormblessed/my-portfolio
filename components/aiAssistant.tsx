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

const welcomeMessages: ChatMessage[] = [{
    id: "welcome_message",
    role: "assistant",
    parts: [{
        type: "text",
        text: "Hi! I'm Matthew's AI assistant. I can answer questions about his experience, explain how his projects work, and help you determine whether he's a good fit for your team.",
    }],
}];

export default function AiAssistant() {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [inputError, setInputError] = useState("");
    const [storageLoaded, setStorageLoaded] = useState(false);
    const [showGoToBottom, setShowGoToBottom] = useState(false);

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
        messages: welcomeMessages,
        onError(err) {
            setInputError(err.message);
        }
    });

    function scrollToBottom() {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (status === "ready" || status === "streaming") {
            scrollToBottom();
        }
    }, [status]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const updateScrollButton = () => {
            const distanceFromBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight;
            setShowGoToBottom(distanceFromBottom > 80);
        };

        container.addEventListener("scroll", updateScrollButton);
        updateScrollButton();

        return () => container.removeEventListener("scroll", updateScrollButton);
    }, [status]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("aiconvo");

            if (stored) {
                const parsed = JSON.parse(stored);

                if (parsed.expiry && parsed.expiry > Date.now() && Array.isArray(parsed.messages)) {
                    setMessages(parsed.messages);
                } else {
                    localStorage.removeItem("aiconvo");
                }
            }
        } catch {
            localStorage.removeItem("aiconvo");
        } finally {
            setStorageLoaded(true);
        }
    }, [setMessages]);

    useEffect(() => {
        // expiry is set to 24 hours from now
        if (storageLoaded && messages.length > 0 && status === "ready") {
            localStorage.setItem("aiconvo", JSON.stringify({ messages, expiry: Date.now() + 1000 * 60 * 60 * 24 }));
        }
    }, [messages, status, storageLoaded]);

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
        <div className="flex h-[90vh] flex-col rounded-xl border border-white/10 bg-[#0f0f0f] shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0a0a0a]">
                        <Image src={aiSVG} width={22} height={22} alt="AI assistant" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight">Ask My AI Assistant</h3>
                        <p className="text-sm text-white/60">
                            Powered by retrieval-augmented generation
                        </p>
                    </div>
                </div>
                <button
                    className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                    onClick={() => {
                        localStorage.removeItem("aiconvo");
                        setMessages([
                            {
                                id: "welcome_message",
                                role: "assistant",
                                parts: [
                                    {
                                        type: "text",
                                        text: "Hi! I'm Matthew's AI assistant. I can answer questions about his experience, explain how his projects work, and help you determine whether he's a good fit for your team.",
                                    },
                                ],
                            },
                        ]);
                    }}
                >
                    New chat
                </button>
            </div>
            <div className="relative flex-1 min-h-0">
                <div ref={scrollContainerRef} className="overflow-auto scrollbar-none w-full h-full px-4 py-6">
                    {messages.map((m, index) => {
                        const isLatestAssistant = index === messages.length - 1 && m.role === "assistant";
                        const showIfLatest = isLatestAssistant && (status === "ready" || status === "streaming") && m.parts.some(part => part.type === "text");
                        if (!(index !== messages.length - 1 || m.role !== "assistant") && !showIfLatest) {
                            if (index !== messages.length - 1 || m.role !== "assistant") {
                                return null;
                            }
                        }

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className={`flex flex-row gap-3 ${m.role === "assistant" ? "justify-start" : "justify-end"}`}
                            >
                                {m.role === "assistant" && (
                                    <div className="mt-3 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0f0f0f]">
                                        <Image src={aiSVG} width={20} height={20} alt="AI assistant" />
                                    </div>
                                )}
                                <div className={`flex max-w-[85%] flex-col sm:max-w-[72%] ${m.role === "assistant" ? "" : "items-end"}`}>
                                    <div
                                        className={`mt-3 rounded-2xl px-4 py-3 text-left shadow-sm ${m.role === "assistant"
                                            ? "border border-white/10 bg-[#1a1a1a] text-white"
                                            : "bg-[var(--color-accent)] text-white"
                                            }`}
                                    >
                                        <div className="prose prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10">
                                            {m.parts.map((part, partIndex) => {
                                                if (part.type !== "text") {
                                                    return null;
                                                }
                                                return <ReactMarkdown key={partIndex} remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
                                            })}
                                        </div>
                                    </div>
                                    <MessageSources m={m} />
                                </div>
                            </motion.div>
                        )
                    })}

                    <div ref={bottomRef}></div>
                </div>
                {showGoToBottom && (
                    <button
                        type="button"
                        onClick={scrollToBottom}
                        className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-[#0f0f0f] px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors duration-150 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                    >
                        Go to bottom
                    </button>
                )}
            </div>
            {status !== "ready" && !error ? (
                <div className="ml-4 flex flex-row items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0f0f0f]">
                        <Image src={aiSVG} width={20} height={20} alt="AI assistant" />
                    </div>
                    <div className="flex h-9 w-14 items-center justify-center gap-1 rounded-full border border-white/10 bg-[#1a1a1a]">
                        <div className="animate-bounce [animation-delay:0ms]">.</div>
                        <div className="animate-bounce [animation-delay:150ms]">.</div>
                        <div className="animate-bounce [animation-delay:300ms]">.</div>
                    </div>
                </div>
            ) : (
                ""
            )}
            <div className='mt-2'></div>

            <div className='flex flex-col text-[18px] gap-2 mt-auto items-center w-full justify-center'>
                {status === 'ready' && (
                    <div className="flex flex-wrap items-center justify-center gap-2 px-4">
                        <motion.button
                            onClick={() => {
                                setInputValue("What did Matthew build at Sorenson?")
                                SendInput("What did Matthew build at Sorenson?")
                            }}
                            whileHover={{ scale: 1.02 }}
                            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white transition-colors duration-150 ease-in-out hover:bg-white/10 sm:text-sm"
                        >
                            What did Matthew build at Sorenson?
                        </motion.button>
                        <motion.button
                            onClick={() => {
                                setInputValue("What AI projects has Matthew built?")
                                SendInput("What AI projects has Matthew built?")
                            }}
                            whileHover={{ scale: 1.02 }}
                            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white transition-colors duration-150 ease-in-out hover:bg-white/10 sm:text-sm"
                        >
                            What AI projects has Matthew built?
                        </motion.button>
                        <motion.button
                            onClick={() => {
                                setInputValue("What technologies does Matthew work with?")
                                SendInput("What technologies does Matthew work with?")
                            }}
                            whileHover={{ scale: 1.02 }}
                            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white transition-colors duration-150 ease-in-out hover:bg-white/10 sm:text-sm"
                        >
                            What technologies does Matthew work with?
                        </motion.button>
                        <motion.button
                            onClick={() => {
                                setInputValue("Tell me about Travel Planner.")
                                SendInput("Tell me about Travel Planner.")
                            }}
                            whileHover={{ scale: 1.02 }}
                            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white transition-colors duration-150 ease-in-out hover:bg-white/10 sm:text-sm"
                        >
                            Tell me about Travel Planner.
                        </motion.button>
                    </div>
                )}
                <div className="mx-auto flex w-full max-w-2xl flex-row items-end gap-2 rounded-2xl border border-white/15 bg-[#1a1a1a] px-4 py-2 shadow-sm">
                    <textarea
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                SendInput();
                            }
                        }}
                        className="max-h-40 min-h-10 w-full resize-none bg-transparent text-sm text-white outline-none field-sizing-content scrollbar-none placeholder:text-white/40 sm:text-base"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about Matthew's experience, projects, or skills..."
                    />
                    <button
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)] text-white transition-colors duration-150 ease-in-out hover:bg-[var(--color-accent)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 disabled:opacity-50"
                        onClick={() => {
                            SendInput();
                        }}
                        disabled={status !== "ready"}
                        aria-label="Send message"
                    >
                        <Image src={sendSVG} width={18} height={18} alt="Send message" />
                    </button>
                </div>
                <div className={`${inputError ? 'mt-2' : ''} text-red-600`}>{inputError}</div>
            </div>

        </div>
    )
}
