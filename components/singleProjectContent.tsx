"use client";
import { useState } from "react";
import Image from "next/image";

export type ProjectData = {
  title: string;
  description: string;
  githubUrl: string;
  projectWebsite?: string;
  images: string[];
  diagram?: string;
  howItWorks: string;
  challenges: string;
  techStack: string[];
};

export default function SingleProjectContent({ data }: { data: ProjectData }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl text-amber-300">{data.title}</h1>
      {data.techStack && data.techStack.length > 0 && (
        <>
          <div className="hidden md:block">
            <ul className="flex flex-row gap-4 mt-4 mb-4">
              {data.techStack.map((tech, index) => (
                <li className="bg-blue-700 text-orange-400 font-bold px-2 rounded-2xl flex items-center justify-center" key={index}>{tech}</li>
              ))}
            </ul>
          </div>
          <div className="sm:hidden">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {dropdownOpen ? "Hide Tech Stack" : "Show Tech Stack"}
            </button>
            <ul className="flex flex-col gap-4 mt-4 mb-4">
              {dropdownOpen && data.techStack.map((tech, index) => (
                <li className="bg-blue-700 text-orange-400 font-bold px-2 rounded-2xl flex items-center justify-center" key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      <h1>{data.description}</h1>
      {data.images && data.images.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-4 m-4">
          {data.images.map((img, index) => (
            <Image src={img} width={700} height={450} className='mb-5' alt={`picture for project ${data.title}`} key={index} />
          ))}
        </div>
      )}
      {data.diagram && (
        <Image src={data.diagram} width={2000} height={550} alt="diagram" onClick={() => window.open(data.diagram, '_blank')} />
      )}
      <h1 className="text-2xl font-bold mt-8">How it works</h1>
      <h2 className="max-w-3xl">{data.howItWorks}</h2>
      <h1 className="text-2xl font-bold mt-8">Challenges</h1>
      <h2 className="max-w-3xl mb-8">{data.challenges}</h2>
      <a
        href={data.githubUrl}
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
        href={data.projectWebsite}
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
  );
}
