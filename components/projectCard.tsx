import React from 'react';
import Image from "next/image";

type ProjectCardProps = {
    title: string;
    description: string;
    githubUrl: string;
    projectWebsite?: string;
    image?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, githubUrl, projectWebsite, image }) => (
    <div style={{
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '1rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        background: '#fff',
        maxWidth: 400,
    }
    } className='flex flex-col items-center'>
        <h2 style={{ margin: '0 0 0.5rem 0', color: 'black', fontWeight: 'bold' }}>{title}</h2>
        {image && 
        <Image src={image} width={300} height={250} className='h-[750px] w-[400px] mb-5' alt={`picture for project ${title}`} />
        }
        <p style={{ margin: '0 0 1rem 0', color: '#555' }}>{description}</p>
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
            GitHub
        </a>
        {projectWebsite && 
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
        </a>}
    </div>
);

export default ProjectCard;