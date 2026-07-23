"use client";
import Head from "next/head";
import Navbar from "@/components/navbar";
import ProjectCard from "@/components/projectCard";

export default function Projects() {
    return (
        <>
            <Head>
                <title>Matthew Johnson | Software Engineer</title>
                <meta name="description" content="Portfolio of Matthew Johnson" />
            </Head>

            <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
                <Navbar />
                <div>
                    <h1 className="text-3xl font-bold mb-8 mt-3 flex justify-center">My projects</h1>
                    <div className="flex flex-col md:flex-row items-center justify-center p-12 gap-4">
                     <ProjectCard
                        title="PopChoice — AI Movie Recommender"
                        description="AI-powered movie recommendation platform that uses semantic vector search and large language models to deliver personalized recommendations for groups of users."
                        githubUrl="https://github.com/Matthew-Stormblessed/PopChoice"
                        projectWebsite="https://mjpopchoice.netlify.app"
                        image="/PopChoice2.png"
                        dataFile="./app/data/PopChoice.json"
                    />
                    <ProjectCard
                        title="AI Travel Planner"
                        description="AI travel planning assistant that coordinates flights, hotels, and weather through an agent-based workflow to generate personalized trip recommendations."
                        githubUrl="https://github.com/Matthew-Stormblessed/travel-agent"
                        projectWebsite="https://mjtravel-agent.netlify.app"
                        image="/TravelPlanner2.png"
                        dataFile="./app/data/TravelAgent.json"
                    />
                     <ProjectCard
                        title="Pollyglot — AI Translator"
                        description="AI-powered translation application featuring a conversational interface for translating text between English, French, Spanish, and Japanese."
                        githubUrl="https://github.com/Matthew-Stormblessed/pollygot"
                        projectWebsite="https://pollygot99.netlify.app"
                        image="/PollyGlot.png"
                        dataFile="./app/data/PollyGlot.json"
                    />
                    </div>
                </div>
            </main>
        </>
    );
}
