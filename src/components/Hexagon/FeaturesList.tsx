import { useState, useRef, useEffect } from "react";
import "./features.css";

export interface Feature {
  id: string;
  hexIcon: string;
  text: string;
}

interface FeaturesListProps {
  features: Feature[];
  onSelect: (id: string) => void;
  activeId?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function FeaturesList({
  features,
  onSelect,
  activeId,
  className = "",
  title,
  subtitle,
}: FeaturesListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeId || !scrollRef.current) return;

    // Solo ejecutar en mobile (cuando overflow-x es scroll)
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    // Buscar el elemento activo dentro del contenedor
    // Nota: dependemos de que el div 'icon-active' sea hijo directo o nieto
    // En este caso, buscamos por clase
    const list = scrollRef.current;
    if (!list) return;

    // Buscar el hijo con la clase 'feature-active'
    const activeEl = list.querySelector(".feature-active");

    if (activeEl instanceof HTMLElement) {
      const containerRect = list.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();

      // Calcular scroll relativo
      const scrollLeft =
        activeEl.offsetLeft - list.clientWidth / 2 + activeEl.clientWidth / 2;

      list.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeId]);

  const activeIndex = features.findIndex((f) => f.id === activeId);

  return (
    <div className={`features ${className}`}>
      <header className="section-header">
        <h1 style={{ fontFamily: "Bai Jamjuree" }}>
          <img src="/lineatitle.svg" alt="" className="title-svg" />
          {title || ""}
        </h1>
        <p className="section-subtitle">{subtitle || ""}</p>
      </header>
      {/* Mapeo único para filas que contienen icono y texto */}
      <div className="features__list" ref={scrollRef}>
        {features.map((feature, index) => {
          const isHovered = hoveredId === feature.id;
          const isActive = activeId === feature.id;

          // Calcular distancia para efectos 3D en mobile
          let offset = 0;
          if (activeIndex !== -1) {
            offset = index - activeIndex;
          }

          return (
            <div
              key={feature.id}
              className={`
                feature-item
                ${index % 2 === 0 ? "feature-left" : "feature-right"}
                ${isHovered ? "feature-hovered" : ""}
                ${isActive ? "feature-active" : ""}
              `}
              data-offset={offset}
              onClick={() => onSelect(feature.id)}
              onMouseEnter={() => setHoveredId(feature.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={
                {
                  cursor: "pointer",
                  "--offset": offset,
                } as React.CSSProperties
              }
            >
              <div className="feature-icon">
                <img src={feature.hexIcon} alt="" className="icon-img" />
              </div>
              <div className="feature-text">{feature.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
