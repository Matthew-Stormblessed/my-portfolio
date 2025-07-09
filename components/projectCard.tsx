import React from 'react';

type ProjectCardProps = {
    title: string;
    description: string;
    githubUrl: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, githubUrl }) => (
    <div style={{
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '1rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        background: '#fff',
        maxWidth: 400
    }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: 'black', fontWeight: 'bold' }}>{title}</h2>
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
            View on GitHub
        </a>
    </div>
);

export default ProjectCard;