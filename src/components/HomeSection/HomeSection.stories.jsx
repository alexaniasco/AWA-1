import HomeSection from './HomeSection';

export default {
    title: 'Sections/HomeSection',
    component: HomeSection,
    decorators: [
        (Story) => (
            <div style={{ minHeight: '100vh', background: '#fff' }}>
                <Story />
            </div>
        ),
    ],
};

export const Default = {
    render: () => <HomeSection />,
};
