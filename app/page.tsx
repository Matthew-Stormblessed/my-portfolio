"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";
import AIAssistant from "@/components/aiAssistant";
import ProjectCard from "@/components/projectCard";
import { motion } from "motion/react";

import portfolioAssistant from "@/app/data/PortfolioAssistant.json";
import popChoice from "@/app/data/PopChoice.json";
import travelAgent from "@/app/data/TravelAgent.json";

const technologies = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "AWS",
  "OpenAI",
  "Supabase",
];

const featuredProjects = [
  {
    title: portfolioAssistant.title,
    description: portfolioAssistant.description,
    image: portfolioAssistant.images?.[0] ?? "/portfolioAssistant.png",
    dataFile: "PortfolioAssistant.json",
    techStack: portfolioAssistant.techStack,
    projectWebsite: portfolioAssistant.projectWebsite,
  },
  {
    title: popChoice.title,
    description: popChoice.description,
    image: popChoice.images?.[1] ?? "/PopChoice2.png",
    dataFile: "PopChoice.json",
    techStack: popChoice.techStack,
    projectWebsite: popChoice.projectWebsite,
  },
  {
    title: travelAgent.title,
    description: travelAgent.description,
    image: travelAgent.images?.[1] ?? "/TravelPlanner2.png",
    dataFile: "TravelAgent.json",
    techStack: travelAgent.techStack,
    projectWebsite: travelAgent.projectWebsite,
  },
];

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
              >
                Software Engineer
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                className="mt-6 text-xl text-white/80 sm:text-2xl"
              >
                I build full-stack applications and AI-powered software.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                className="mt-6 text-lg leading-8 text-white/60 sm:text-xl"
              >
                Software Engineer with 3 years of professional experience
                building web applications, cloud infrastructure, and AI-powered
                tools.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link
                  href="/projects"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-[var(--color-accent)] px-8 text-sm font-semibold text-white shadow-sm transition-colors duration-200 ease-in-out hover:bg-[var(--color-accent)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                >
                  View Projects
                </Link>
                <Link
                  href="/About"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 bg-white/5 px-8 text-sm font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  About Me
                </Link>
                <a
                  href="/MatthewJohnson_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-medium text-white/70 transition-colors duration-200 ease-in-out hover:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                >
                  View Resume
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-8 sm:gap-x-8"
              >
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-sm text-white/50 transition-colors duration-200 ease-in-out hover:text-white/70"
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Featured Work
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                className="mt-4 text-lg text-white/70"
              >
                A selection of applications I've built using modern web and AI
                technologies.
              </motion.p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.dataFile}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  dataFile={project.dataFile}
                  techStack={project.techStack}
                  projectWebsite={project.projectWebsite}
                />
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center text-sm font-medium text-[var(--color-accent)] transition-colors duration-150 ease-in-out hover:text-white"
              >
                View all projects →
              </Link>
            </div>
          </div>
        </section>
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Ask My AI Assistant
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                className="mt-4 text-lg text-white/70"
              >
                Ask about Matthew's experience, projects, skills, and background.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="mt-12"
            >
              <AIAssistant />
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
