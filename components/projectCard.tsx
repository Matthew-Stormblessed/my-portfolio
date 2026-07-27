import React from 'react';
import Link from "next/link"
import Image from "next/image";

type ProjectCardProps = {
    title: string;
    description: string;
    githubUrl: string;
    projectWebsite?: string;
    image?: string;
    dataFile?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, image, dataFile }) => (
    <Link href={{pathname: "/singleProject", query: { dataFile }}} style={{ textDecoration: 'none' }}>
    <div style={{
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '1rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        background: '#fff',
    }
    } className='flex flex-col items-center h-250 hover:scale-105 transition-transform duration-300 ease-in-out'>
        <h2 style={{ margin: '0 0 0.5rem 0', color: 'black', fontWeight: 'bold' }}>{title}</h2>
        {image && (
            <Image src={image} alt={title} className="mb-4 w-auto h-200" width={400} height={400} />
        )}
        <p style={{ margin: '0 0 1rem 0', color: '#555' }}>{description}</p>
    </div>
    </Link>
);

export default ProjectCard;