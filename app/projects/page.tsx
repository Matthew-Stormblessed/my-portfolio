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
                        title="Project 2"
                        description="Description for project 2"
                        githubUrl="https://github.com/user/project2"
                    />
                    </div>
                </div>
            </main>
        </>
    );
}
