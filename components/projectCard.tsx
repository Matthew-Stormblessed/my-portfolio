import React from 'react';
import { motion } from "motion/react"
import Link from "next/link"

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
    <motion.div whileHover={{ scale: 1.05 }} style={{
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '1rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        background: '#fff',
        maxWidth: 400,
    }
    } className='flex flex-col items-center min-h-70'>
        <h2 style={{ margin: '0 0 0.5rem 0', color: 'black', fontWeight: 'bold' }}>{title}</h2>
        {image && (
            <img src={image} alt={title} className="w-full h-170 mb-4" />
        )}
        <p style={{ margin: '0 0 1rem 0', color: '#555' }}>{description}</p>
    </motion.div>
    </Link>
);

export default ProjectCard;