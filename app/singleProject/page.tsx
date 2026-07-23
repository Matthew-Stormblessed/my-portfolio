'use client'
import Navbar from "@/components/navbar"
import { useState, useEffect } from 'react'
import Image from "next/image";

export default function SingleProject() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [githubUrl, setgitHubUrl] = useState("");
    const [projectWebsite, setProjectWebsite] = useState("");
    const [images, setImages] = useState([]);
    const [diagram, setDiagram] = useState("");
    const [howItWorks, setHowItWorks] = useState("");
    const [challenges, setChallenges] = useState("");
    const [techStack, setTechStack] = useState([""]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {

        const FetchData = async () => {
            try {
                const dataFile = new URLSearchParams(window.location.search).get('dataFile');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/getProjectData`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataFile)

                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTitle(data.title);
                setDescription(data.description);
                setgitHubUrl(data.githubUrl);
                setProjectWebsite(data.projectWebsite);
                setImages(data.images);
                setDiagram(data.diagram);
                setHowItWorks(data.howItWorks);
                setChallenges(data.challenges);
                setTechStack(data.techStack);

            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        FetchData();
    }, [])

    return (
        <main className="min-h-screen bg-gray-900 text-white px-6 py-16">
            <Navbar />
            <div className="flex flex-col items-center">
                <h1 className="text-5xl text-amber-300">{title}</h1>
                {techStack && techStack.length > 0 && (
                    <>
                    <div className="hidden md:block">
                    <ul className="flex flex-row gap-4 mt-4 mb-4">
                        {techStack.map((tech, index) => (
                            <li className="bg-blue-700 text-orange-400 font-bold px-2 rounded-2xl flex items-center justify-center" key={index}>{tech}</li>
                        ))}
                    </ul>
                    </div>
                    <div className="sm:hidden">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        {dropdownOpen ? "Hide Tech Stack" : "Show Tech Stack"}
                    </button>
                    <ul className="flex flex-col gap-4 mt-4 mb-4">
                        {dropdownOpen && techStack.map((tech, index) => (
                            <li className="bg-blue-700 text-orange-400 font-bold px-2 rounded-2xl flex items-center justify-center" key={index}>{tech}</li>
                        ))}
                    </ul>
                    </div>
                    </>
                )}
                <h1>{description}</h1>
                {images && images.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-4 m-4">
                        {images.map((img, index) => (
                            <Image src={img} width={300} height={250} className='h-[750px] w-[400px] mb-5' alt={`picture for project ${title}`} key={index} />
                        ))}
                    </div>
                )}
                {diagram && (
                    <Image src={diagram} width={2000} height={550} alt="diagram" onClick={() => window.open(diagram, '_blank')} />
                )}
                <h1 className="text-2xl font-bold mt-8">How it works</h1>
                <h2 className="max-w-3xl">{howItWorks}</h2>
                <h1 className="text-2xl font-bold mt-8">Challenges</h1>
                <h2 className="max-w-3xl mb-8">{challenges}</h2>
                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: '#0366d6',
                        textDecoration: 'none',
                        fontWeight: 500
                    }}
                >
                    Source code
                </a>
                <a
                    href={projectWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: '#0366d6',
                        textDecoration: 'none',
                        fontWeight: 500
                    }}
                >
                    Live demo
                </a>
            </div>
        </main>
    )
}
