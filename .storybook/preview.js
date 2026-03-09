import React from 'react';
import '../src/index.css';
import { AppProvider } from '../src/context/AppProvider';
import { ServiceCardProvider } from '../src/components/ServicesCards/hooks/ServiceCardContext';

/** @type { import('@storybook/react').Preview } */
const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) => React.createElement(
            AppProvider,
            null,
            React.createElement(
                ServiceCardProvider,
                null,
                React.createElement(Story, null)
            )
        ),
    ],
};

export default preview;
