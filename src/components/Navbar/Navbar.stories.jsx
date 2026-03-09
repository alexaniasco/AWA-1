import Navbar from './Navbar';

export default {
    title: 'Navigation/Navbar',
    component: Navbar,
    decorators: [
        (Story) => (
            <div style={{ minHeight: '100vh', background: '#000' }}>
                <Story />
            </div>
        ),
    ],
};

export const Desktop = {
    render: () => <Navbar />,
};

export const Mobile = {
    render: () => <Navbar />,
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
    },
};
