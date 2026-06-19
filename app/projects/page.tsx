import Head from "next/head";
import Image from "next/image";
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
                    <h1 className="text-3xl font-bold mb-8 mt-3 flex justify-center"> My projects</h1>
                    <div className="flex flex-col justify-center p-12">
                    <ProjectCard
                        title="Portfolio Website"
                        description="A personal portfolio website showcasing my projects and skills."
                        githubUrl="https://github.com/Matthew-Stormblessed/my-portfolio"
                    />
                    <ProjectCard
                        title="Pollygot Website"
                        description="A website that utilizes OpenAI to translate text for the user."
                        githubUrl="https://github.com/Matthew-Stormblessed/pollygot"
                        projectWebsite="https://pollygot99.netlify.app"
                    />
                    <ProjectCard
                        title="School projects"
                        description="A collection of my school projects."
                        githubUrl="https://github.com/Stormblessed39/Projects"
                    />
                    </div>
                </div>
            </main>
        </>
    );
}
