import SecondSection from './SecondSection';
import { AppContext } from '../../context/AppContext';
import { useContext, useEffect } from 'react';

const ScrollTrigger = ({ progress, children }) => {
    const { setScrollProgress } = useContext(AppContext);
    useEffect(() => {
        setScrollProgress(progress);
    }, [progress, setScrollProgress]);
    return children;
};

export default {
    title: 'Sections/SecondSection',
    component: SecondSection,
};

export const Entering = {
    render: () => (
        <ScrollTrigger progress={0.1}>
            <SecondSection />
        </ScrollTrigger>
    ),
};

export const Active = {
    render: () => (
        <ScrollTrigger progress={0.2}>
            <SecondSection />
        </ScrollTrigger>
    ),
};

export const Exiting = {
    render: () => (
        <ScrollTrigger progress={0.35}>
            <SecondSection />
        </ScrollTrigger>
    ),
};
