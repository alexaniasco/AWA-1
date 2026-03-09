import React from 'react';
import HeroFeatureCard from './HeroFeatureCard';
import './HeroFeatureCard.css';

export default {
    title: 'Hexagon/HeroFeatureCard',
    component: HeroFeatureCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        title: 'Tercerizacion',
        description: 'Refuerzo estratégico para escalar sin fricción de forma inteligente.',
        image: '/navbaricon.webp', // Using an existing image from the public folder
    },
};

export const WithStack = {
    args: {
        title: 'Empresas IT',
        description: 'Simplificá tu gestión con nuestro apoyo. Optimizamos flujos para acelerar tiempos sin perder calidad.',
        image: '/navbaricon.webp',
    },
    decorators: [
        (Story) => (
            <div style={{ padding: '3rem', background: '#f0f0f0', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Story />
            </div>
        ),
    ],
};
