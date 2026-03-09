import ServiceCards from './ServiceCards';
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
    title: 'Sections/ServiceCards',
    component: ServiceCards,
};

export const Active = {
    render: () => (
        <ScrollTrigger progress={0.85}>
            <ServiceCards />
        </ScrollTrigger>
    ),
};
