import "./SectionsGroup.css";
import useSectionGroupService from "./hooks/useSectionGroupService";
import Section from "./components/Section";

const sectionsConfig = [
    {
        label: "EMPRESA",
        position: "right"
    },
    {
        label: "PROFESIONAL",
        position: "left"
    },
    {
        label: "EXCLUSIVO",
        position: "right"
    }
];

export default function SectionsGroup({ activeInfo, isVisible2, handleBackClick }) {

    const { setCurrentText } = useSectionGroupService()

    const handleBack = () => {
        setCurrentText('initial');
        if (handleBackClick) handleBackClick();
    };

    return (
        <div className="section-container">
            {sectionsConfig.map((config) => (
                activeInfo === config.label && isVisible2 && (
                    <Section 
                        key={config.label}
                        section={config.label} 
                        position={config.position} 
                        handleBack={handleBack} 
                    />
                )
            ))}
        </div>
    );
};

