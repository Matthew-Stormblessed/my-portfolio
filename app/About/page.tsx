import Head from "next/head";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default function About() {
    return (
        <>
            <Head>
                <title>Matthew Johnson | Software Engineer</title>
                <meta name="description" content="Portfolio of Matthew Johnson" />
            </Head>

            <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
                <Navbar />
                <div className="max-w-2xl mx-auto mt-16 bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 className="text-4xl font-bold mb-4 text-blue-400">About Me</h1>
                    <p className="text-lg text-gray-300 mb-6">
                        Hi! I'm Matthew Johnson, a passionate Software Engineer dedicated to building modern, scalable web applications. I love working with React, TypeScript, and the latest web technologies to create seamless user experiences.
                    </p>
                    <p className="text-lg text-gray-300 mb-6">
                        My journey in software development started with a desire to create projects that give others enjoyment. Eventually this developed into a passion for coding itself and the capacity it gives me to solve real-world problems. Over the years, I have worked with so many amazing people on projects that meant something greater. Software can make a real difference in people's lives, and I strive to be a part of that change.
                    </p>
                    <p className="text-lg text-gray-300 mb-6">
                        When I'm not coding, you can find me playing video games, reading fantasy novels, or spending time with friends and family. I'm always eager to learn and take on new challenges!
                    </p>
                    <div className="flex gap-4 mt-6">
                        <a href="mailto:matthewisaacjohnson@gmail.com" className="text-blue-400 hover:underline">Email Me</a>
                        <a href="https://github.com/Matthew-Stormblessed" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub</a>
                        <a href="https://www.linkedin.com/in/matthew-johnson-950631152" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">LinkedIn</a>
                    </div>
                </div>
            </main>
        </>
    );
}
