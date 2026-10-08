"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Navbar from "@/components/navbar";

const sorensonTech = [
  "React",
  "Next.js",
  "TypeScript",
  "Playwright",
  "GitHub Actions",
  "Terraform",
  "CI/CD",
];

export default function About() {
  return (
    <>
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                About Me
              </h1>
              <p className="mt-6 text-xl leading-8 text-white/80">
                Software Engineer focused on building modern, scalable web
                applications and AI-powered tools.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-16 space-y-8 rounded-xl border border-white/10 bg-[#0f0f0f] p-8 sm:p-10"
            >
              <p className="text-lg leading-8 text-white/80">
                Hi! I'm Matthew Johnson, a passionate Software Engineer
                dedicated to building modern, scalable web applications. I love
                working with React, TypeScript, and the latest web technologies
                to create seamless user experiences.
              </p>
              <p className="text-lg leading-8 text-white/70">
                My journey in software development started with a desire to
                create projects that give others enjoyment. Eventually this
                developed into a passion for coding itself and the capacity it
                gives me to solve real-world problems. Over the years, I have
                worked with so many amazing people on projects that meant
                something greater. Software can make a real difference in
                people's lives, and I strive to be a part of that change.
              </p>
              <p className="text-lg leading-8 text-white/70">
                When I'm not coding, you can find me playing video games,
                reading fantasy novels, or spending time with friends and
                family. I'm always eager to learn and take on new challenges!
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="mailto:matthewisaacjohnson@gmail.com"
                  className="inline-flex items-center rounded-md bg-[var(--color-accent)] px-6 py-2 text-sm font-medium text-white transition-colors duration-150 ease-in-out hover:bg-[var(--color-accent)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                >
                  Email Me
                </a>
                <a
                  href="https://github.com/Matthew-Stormblessed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-6 py-2 text-sm font-medium text-white transition-colors duration-150 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/matthew-johnson-950631152"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-6 py-2 text-sm font-medium text-white transition-colors duration-150 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  LinkedIn
                </a>
                <a
                  href="/MatthewJohnson_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white/70 transition-colors duration-150 ease-in-out hover:text-[var(--color-accent)]"
                >
                  View Resume
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Professional Experience
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                className="mt-4 text-lg text-white/70"
              >
                Building reliable, user-focused web applications in production
                environments.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-12 space-y-8 rounded-xl border border-white/10 bg-[#0f0f0f] p-8 sm:p-10"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    Sorenson Communications
                  </h3>
                  <p className="mt-1 text-lg text-[var(--color-accent)]">
                    Software Engineer
                  </p>
                </div>
                <p className="text-sm text-white/60 sm:text-base">
                  July 2022 — July 2025
                </p>
              </div>
              <p className="text-lg leading-8 text-white/80">
                Matthew worked as a Software Engineer at Sorenson Communications,
                where he primarily developed and maintained user-facing web
                applications.
              </p>
              <div>
                <h4 className="text-lg font-semibold">
                  Professional responsibilities
                </h4>
                <ul className="mt-4 grid gap-3 text-white/70 sm:grid-cols-2">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>Developing React and Next.js user interfaces</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>Building production-ready frontend features</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>
                      Collaborating closely with UX designers using Figma
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>
                      Implementing responsive and accessible user experiences
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>
                      Maintaining automated Playwright test suites for Windows
                      and macOS
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>
                      Debugging production issues and maintaining existing
                      applications
                    </span>
                  </li>
                </ul>
              </div>
              <p className="text-base leading-7 text-white/70">
                Notable projects included Express Web, where Matthew developed
                the application's home page, language selector, and post-call
                survey experience.
              </p>
              <div>
                <h4 className="text-lg font-semibold">Additional engineering work</h4>
                <ul className="mt-4 grid gap-3 text-white/70 sm:grid-cols-2">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>Building GitHub Actions workflows</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>Maintaining CI/CD pipelines</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>Working with Terraform infrastructure</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>Supporting Zoom VRS web applications</span>
                  </li>
                  <li className="flex gap-2 sm:col-span-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>
                      Investigating browser-specific issues, including Firefox
                      compatibility bugs
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {sorensonTech.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Education
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-12 rounded-xl border border-white/10 bg-[#0f0f0f] p-8 sm:p-10"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    Weber State University
                  </h3>
                  <p className="mt-1 text-lg text-[var(--color-accent)]">
                    Bachelor of Science in Computer Science
                  </p>
                </div>
                <p className="text-sm text-white/60 sm:text-base">
                  May 2022 | GPA: 4.0
                </p>
              </div>
              <p className="mt-6 leading-8 text-white/70">
                Matthew earned a Bachelor of Science in Computer Science from
                Weber State University. During his degree, he developed a strong
                foundation in software engineering, algorithms, data structures,
                object-oriented programming, databases, and computer systems.
              </p>
              <p className="mt-4 leading-8 text-white/70">
                His coursework provided the foundation that he later built upon
                through professional software engineering experience and AI
                application development.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
