"use client";

import Navbar from "@/components/navbar";
import { motion } from "motion/react";

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
    description:
      "A 114-hour, 258-lesson learning path focused on building practical AI-powered applications.",
    image: "/certificates/ai-engineer.jpg",
    issued: "July 8, 2026",
    credentialUrl: "/certificates/ai-engineer.pdf",
  },
  {
    title: "Learn React",
    description:
      "A 15.1-hour, 357-lesson course covering modern React fundamentals and application development.",
    image: "/certificates/react.jpg",
    issued: "March 24, 2026",
    credentialUrl: "/certificates/react.pdf",
  },
  {
    title: "Learn AI Agents",
    description:
      "A 31-lesson course focused on creating AI agents and understanding agent-based workflows.",
    image: "/certificates/ai-agents.jpg",
    issued: "July 8, 2026",
    credentialUrl: "/certificates/ai-agents.pdf",
  },
  {
    title: "Learn Context Engineering",
    description:
      "A 15-lesson course covering the design and management of effective context for AI systems.",
    image: "/certificates/context-engineering.jpg",
    issued: "July 8, 2026",
    credentialUrl: "/certificates/context-engineering.pdf",
  },
];

export default function Certificates() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Certifications
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
              className="mt-6 text-lg leading-8 text-white/70"
            >
              A collection of the courses and learning paths I have completed
              while sharpening my frontend, full-stack, and AI engineering
              skills.
            </motion.p>
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="mx-auto mt-8 max-w-2xl rounded-xl border border-white/10 bg-[#0f0f0f] px-6 py-4 text-left text-white/70"
            >
              <p>
                A quick note: I sometimes go by Isaac, so some of my
                certificates are issued under that name.
              </p>
            </motion.aside>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {certificates.map((certificate, index) => (
              <motion.article
                key={certificate.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] shadow-lg transition-colors duration-200 ease-in-out hover:border-[var(--color-accent)]/40"
              >
                <img
                  src={certificate.image}
                  alt={`${certificate.title} certificate`}
                  className="aspect-[16/10] w-full bg-[#0a0a0a] object-contain p-4"
                />
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                      {certificate.title}
                    </h2>
                    {certificate.issued && (
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {certificate.issued}
                      </span>
                    )}
                  </div>
                  <p className="leading-7 text-white/70">
                    {certificate.description}
                  </p>
                  {certificate.credentialUrl && (
                    <a
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex w-fit items-center rounded-md bg-[var(--color-accent)] px-6 py-2 text-sm font-medium text-white transition-colors duration-150 ease-in-out hover:bg-[var(--color-accent)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                    >
                      View credential
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
