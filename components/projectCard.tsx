"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

type ProjectCardProps = {
  title: string;
  description: string;
  githubUrl?: string;
  projectWebsite?: string;
  image?: string;
  dataFile?: string;
  techStack?: string[];
  featured?: boolean;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  image,
  dataFile,
  techStack,
  projectWebsite,
}) => (
  <Link
    href={{ pathname: "/singleProject", query: { dataFile } }}
    className="group block h-full"
    aria-label={`View details for ${title}`}
  >
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] shadow-lg transition-colors duration-200 ease-in-out hover:border-[var(--color-accent)]/40"
    >
      {image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0a0a0a]">
            <Image
              src={image}
              alt={`${title} screenshot`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-contain object-top bg-[#0f0f0f] p-2 transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
              priority={false}
            />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title}
        </h3>
        <p className="text-base leading-7 text-white/70">{description}</p>
        {techStack && techStack.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {techStack.slice(0, 5).map((tech) => (
              <li
                key={tech}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/70"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
          <span className="inline-flex items-center text-sm font-medium text-[var(--color-accent)]">
            View Project →
          </span>
          {projectWebsite && (
            <span className="inline-flex items-center text-sm text-white/60 transition-colors duration-150 ease-in-out hover:text-white">
              Live Demo
            </span>
          )}
        </div>
      </div>
    </motion.div>
  </Link>
);

export default ProjectCard;