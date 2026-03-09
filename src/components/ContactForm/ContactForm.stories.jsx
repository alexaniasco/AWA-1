import ContactForm from './index';

export default {
    title: 'Components/ContactForm',
    component: ContactForm,
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem', minHeight: '100vh' }}>
                <Story />
            </div>
        ),
    ],
};

export const Default = {
    render: () => <ContactForm />,
};
