"use client";
import Navbar from "@/components/navbar";
import Head from "next/head";
import React, { useEffect, useState } from "react";

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

    if (loading) return <div>Loading GitHub Actions...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Head>
                <title>Matthew Johnson | Software Engineer</title>
                <meta name="description" content="Portfolio of Matthew Johnson" />
            </Head>

            <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
                <Navbar />
                <div>
                    <h1>Latest GitHub Action Runs</h1>
                    <ul>
                        {runs.map((run) => (
                            <li key={run.id}>
                                <a href={run.html_url} target="_blank" rel="noopener noreferrer">
                                    {run.name} - {run.status}
                                    {run.conclusion ? ` (${run.conclusion})` : ""}
                                </a>
                                <span style={{ marginLeft: 8, color: "#888" }}>
                                    {new Date(run.created_at).toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </>
    );
}