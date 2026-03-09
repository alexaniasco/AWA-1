import { useState } from "react";
import { TransformControls, OrbitControls } from "@react-three/drei";
import PropTypes from "prop-types";

/**
 * Envuelve cualquier nodo 3D con gizmos de transformación
 * para mover/rotar/escalar en tiempo real SOLO en desarrollo.
 *
 * Simplificado: ahora siempre envuelve a sus hijos con TransformControls
 * (puedes desactivarlo con la prop `enabled`).
 */
const DevTransformControls = ({
  children,
  mode = "translate", // "translate" | "rotate" | "scale"
  enabled = true,
}) => {
  const [dragging, setDragging] = useState(false);

  if (!enabled) return children;

  return (
    <>
      <TransformControls
        mode={mode}
        showX
        showY
        showZ
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
      >
        {children}
      </TransformControls>
      {/* OrbitControls extra para poder orbitar mientras ajustas el modelo.
          Mientras arrastras el gizmo, desactivamos la órbita para que no moleste. */}
      <OrbitControls enabled={!dragging} makeDefault />
    </>
  );
};

DevTransformControls.propTypes = {
  children: PropTypes.node.isRequired,
  mode: PropTypes.oneOf(["translate", "rotate", "scale"]),
  enabled: PropTypes.bool,
};

export default DevTransformControls;


