import LoadingScreen from './LoadingScreen';
import './LoadingScreen.css';

export default {
    title: 'Components/LoadingScreen',
    component: LoadingScreen,
    parameters: {
        layout: 'fullscreen',
    },
};

export const Initial = {
    args: {
        progress: 0,
        isVisible: true,
    },
};

export const Halfway = {
    args: {
        progress: 0.5,
        isVisible: true,
    },
};

export const AlmostDone = {
    args: {
        progress: 0.9,
        isVisible: true,
    },
};
