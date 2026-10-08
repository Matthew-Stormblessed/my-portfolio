"use client";
import Navbar from "@/components/navbar";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

type WorkflowRun = {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  html_url: string;
  created_at: string;
};

const GITHUB_USERNAME = "Matthew-Stormblessed";
const REPO_NAME = "my-portfolio";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

async function fetchWorkflowRuns(): Promise<WorkflowRun[]> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/actions/runs?per_page=10`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch workflow runs");
  const data = await res.json();
  return data.workflow_runs;
}

export default function ActionsPage() {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchWorkflowRuns()
      .then((data) => {
        if (isMounted) {
          setRuns(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-4xl font-bold tracking-tight sm:text-5xl"
            >
              GitHub Actions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
              className="mt-6 text-lg text-white/70"
            >
              Latest GitHub Action runs for this portfolio repository.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="mt-12 overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f]"
          >
            {loading && (
              <div className="px-6 py-8 text-center text-white/70">
                Loading GitHub Actions...
              </div>
            )}
            {error && (
              <div className="px-6 py-8 text-center text-red-400">
                Error: {error}
              </div>
            )}
            {!loading && !error && (
              <ul className="divide-y divide-white/10">
                {runs.map((run) => {
                  const isSuccess = run.conclusion === "success";
                  return (
                    <li
                      key={run.id}
                      className="flex flex-col gap-2 px-6 py-4 transition-colors duration-150 ease-in-out hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isSuccess ? "bg-emerald-400" : "bg-red-400"
                          }`}
                          aria-hidden="true"
                        />
                        <a
                          href={run.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-white/90 transition-colors duration-150 ease-in-out hover:text-[var(--color-accent)]"
                        >
                          {run.name} — {run.status}
                          {run.conclusion ? ` (${run.conclusion})` : ""}
                        </a>
                      </div>
                      <time
                        dateTime={run.created_at}
                        className="text-sm text-white/60"
                      >
                        {new Date(run.created_at).toLocaleString()}
                      </time>
                    </li>
                  );
                })}
                {runs.length === 0 && (
                  <li className="px-6 py-8 text-center text-white/60">
                    No workflow runs found.
                  </li>
                )}
              </ul>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}