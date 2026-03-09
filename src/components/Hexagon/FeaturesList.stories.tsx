import FeaturesList from './FeaturesList';
import './features.css';

export default {
    title: 'Hexagon/FeaturesList',
    component: FeaturesList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const mockFeatures = [
    { id: '1', hexIcon: '/navbaricon.webp', text: 'Opción 1' },
    { id: '2', hexIcon: '/navbaricon.webp', text: 'Opción 2' },
    { id: '3', hexIcon: '/navbaricon.webp', text: 'Opción 3' },
];

export const Default = {
    args: {
        features: mockFeatures,
        activeId: '1',
        onSelect: (id) => console.log('Selected:', id),
    },
};

export const MobileCarousel = {
    args: {
        features: mockFeatures,
        activeId: '2',
        onSelect: (id) => console.log('Selected:', id),
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};
