"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export type ProjectData = {
  title: string;
  description: string;
  githubUrl: string;
  projectWebsite?: string;
  images: string[];
  diagram?: string;
  howItWorks: string;
  challenges: string;
  techStack: string[];
};

export default function SingleProjectContent({ data }: { data: ProjectData }) {
  return (
    <article className="relative">
      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {data.title}
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/80">
              {data.description}
            </p>
            {data.techStack && data.techStack.length > 0 && (
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {data.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 sm:text-sm"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={data.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[var(--color-accent)] px-8 text-sm font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-[var(--color-accent)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              >
                Source code
              </a>
              {data.projectWebsite && (
                <a
                  href={data.projectWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 bg-white/5 px-8 text-sm font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Live demo
                </a>
              )}
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center text-sm font-medium text-white/70 transition-colors duration-150 ease-in-out hover:text-[var(--color-accent)]"
              >
                ← Back to projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {data.images && data.images.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid gap-6 lg:grid-cols-2"
            >
              {data.images.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-lg"
                >
                  <Image
                    src={img}
                    alt={`Screenshot ${index + 1} of ${data.title}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain object-top bg-[#0f0f0f] p-4"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  How it works
                </h2>
                <p className="mt-4 leading-8 text-white/70 whitespace-pre-wrap">
                  {data.howItWorks}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0f0f0f] p-6 sm:p-8">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Challenges &amp; engineering details
                </h2>
                <p className="mt-4 leading-8 text-white/70 whitespace-pre-wrap">
                  {data.challenges}
                </p>
              </div>
            </motion.div>
          </div>
          <aside className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
              className="sticky top-24 space-y-8"
            >
              {data.techStack && data.techStack.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-[#0f0f0f] p-6">
                  <h3 className="text-lg font-semibold">Tech stack</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {data.techStack.map((tech) => (
                      <li
                        key={tech}
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <a
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Source code
                </a>
                {data.projectWebsite && (
                  <a
                    href={data.projectWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    Live demo
                  </a>
                )}
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm text-white/70 transition-colors duration-150 ease-in-out hover:text-[var(--color-accent)]"
                >
                  ← Back to projects
                </Link>
              </div>
            </motion.div>
          </aside>
        </div>
      </section>

      {data.diagram && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Architecture
                </h2>
                <p className="mt-3 text-base text-white/70">
                  High-level system overview
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-lg">
                <Image
                  src={data.diagram}
                  alt={`Architecture diagram for ${data.title}`}
                  width={2000}
                  height={550}
                  className="h-auto w-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </article>
  );
}
