import { OptionsOverlay } from './OptionsOverlay';
import { AppContext } from '../../context/AppContext';
import { useContext, useEffect } from 'react';

export default {
    title: 'Sections/OptionsOverlay',
    component: OptionsOverlay,
};

export const Default = {
    render: () => <OptionsOverlay onOptionClick={() => console.log('Option clicked')} />,
};

const ActiveStory = () => {
    const { setActiveInfo } = useContext(AppContext);
    useEffect(() => {
        setActiveInfo("EMPRESA");
    }, [setActiveInfo]);
    return <OptionsOverlay onOptionClick={() => console.log('Option clicked')} />;
}

export const ActiveSection = {
    render: () => <ActiveStory />,
};
