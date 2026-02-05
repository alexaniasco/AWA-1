import { useState } from "react";
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
}

export default function FeaturesList({
  features,
  onSelect,
  activeId,
  className = "",
}: FeaturesListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={`features ${className}`}>
      {/* ICONOS */}
      <div className="features__icons">
        {features.map((feature, index) => {
          const isHovered = hoveredId === feature.id;
          const isActive = activeId === feature.id;

          return (
            <div
              key={feature.id}
              className={`
                icon-item
                ${index % 2 === 0 ? "icon-left" : "icon-right"}
                ${index === 0 ? "icon-first" : ""}
                ${isHovered ? "icon-hovered" : ""}
                ${isActive ? "icon-active" : ""}
              `}
            >
              <img src={feature.hexIcon} alt="" className="icon-img" />
            </div>
          );
        })}
      </div>

      {/* TEXTOS */}
      <div className="features__texts">
        {features.map((feature, index) => {
          const isHovered = hoveredId === feature.id;
          const isActive = activeId === feature.id;

          return (
            <div
              key={feature.id}
              className={`
                text-item
                ${index % 2 === 0 ? "text-left" : "text-right"}
                ${index === 0 ? "text-first" : ""}
                ${isHovered ? "text-hovered" : ""}
                ${isActive ? "text-active" : ""}
              `}
              onMouseEnter={() => setHoveredId(feature.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelect(feature.id)}
              style={{ cursor: "pointer" }}
            >
              {feature.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
