"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Navbar from "@/components/navbar";

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Let's Connect
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/70">
              If you're looking to collaborate or have questions about my work,
              feel free to reach out through any of the following methods.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="mt-12 rounded-xl border border-white/10 bg-[#0f0f0f] p-8 sm:p-10"
          >
            <ul className="space-y-6">
              <li className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#0a0a0a]">
                  <Image
                    src="/email.svg"
                    alt="Email"
                    width={20}
                    height={20}
                    className="brightness-0 invert opacity-80"
                  />
                </div>
                <a
                  href="mailto:matthewisaacjohnson@gmail.com"
                  className="text-base text-white/80 transition-colors duration-150 ease-in-out hover:text-[var(--color-accent)] sm:text-lg"
                >
                  matthewisaacjohnson@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#0a0a0a]">
                  <Image
                    src="/phone.svg"
                    alt="Phone"
                    width={20}
                    height={20}
                    className="brightness-0 invert opacity-80"
                  />
                </div>
                <a
                  href="tel:+13852434677"
                  className="text-base text-white/80 transition-colors duration-150 ease-in-out hover:text-[var(--color-accent)] sm:text-lg"
                >
                  +1 (385) 243-4677
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#0a0a0a]">
                  <Image
                    src="/linkedin.svg"
                    alt="LinkedIn"
                    width={20}
                    height={20}
                    className="brightness-0 invert opacity-80"
                  />
                </div>
                <a
                  href="https://www.linkedin.com/in/matthew-johnson-950631152"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-white/80 transition-colors duration-150 ease-in-out hover:text-[var(--color-accent)] sm:text-lg"
                >
                  linkedin.com/in/matthew-johnson-950631152
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#0a0a0a]">
                  <Image
                    src="/github.svg"
                    alt="GitHub"
                    width={20}
                    height={20}
                    className="brightness-0 invert opacity-80"
                  />
                </div>
                <a
                  href="https://github.com/Matthew-Stormblessed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-white/80 transition-colors duration-150 ease-in-out hover:text-[var(--color-accent)] sm:text-lg"
                >
                  github.com/Matthew-Stormblessed
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#0a0a0a]">
                  <Image
                    src="/file.svg"
                    alt="Resume"
                    width={20}
                    height={20}
                    className="brightness-0 invert opacity-80"
                  />
                </div>
                <a
                  href="/MatthewJohnson_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-white/80 transition-colors duration-150 ease-in-out hover:text-[var(--color-accent)] sm:text-lg"
                >
                  View Resume
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
