import { SectionCameraControls } from "../../controllers/SectionCameraController";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import PropTypes from "prop-types";

export const Section = ({ children, deviceConfig }) => {
  const {
    scrollProgress,
    setActiveInfo,
    activeInfo,
    setCameraTarget,
    cameraTarget,
    cameraLookAtTarget,
  } = useContext(AppContext);
  return (
    <>
      <SectionCameraControls
        activeInfo={activeInfo}
        setActiveInfo={setActiveInfo}
        setCameraTarget={setCameraTarget}
        scrollProgress={scrollProgress}
        cameraTarget={cameraTarget}
        cameraLookAtTarget={cameraLookAtTarget}
        deviceConfig={deviceConfig}
      />
      {children}
    </>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  deviceConfig: PropTypes.shape({
    isMobile: PropTypes.bool,
    isTablet: PropTypes.bool,
    isDesktop: PropTypes.bool,
  }),
};
