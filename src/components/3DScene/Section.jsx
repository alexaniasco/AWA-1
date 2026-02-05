import { SectionCameraControls } from "../../controllers/SectionCameraController";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
export const Section = ({ children }) => {
  const {
    scrollProgress,
    setActiveInfo,
    activeInfo,
    setCameraTarget,
    cameraTarget,
  } = useContext(AppContext);
  return (
    <>
      <SectionCameraControls
        activeInfo={activeInfo}
        setActiveInfo={setActiveInfo}
        setCameraTarget={setCameraTarget}
        scrollProgress={scrollProgress}
        cameraTarget={cameraTarget}
      />
      {children}
    </>
  );
};
