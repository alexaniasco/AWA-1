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

  // Auto-scroll al item activo en mobile
  useEffect(() => {
    if (!activeId || !scrollRef.current) return;
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const activeEl = scrollRef.current.querySelector(".fl-item--active");
    if (activeEl instanceof HTMLElement) {
      const list = scrollRef.current;
      const scrollLeft =
        activeEl.offsetLeft - list.clientWidth / 2 + activeEl.clientWidth / 2;
      list.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeId]);

  const hasTitle = title && title.trim() !== "";
  const hasSubtitle = subtitle && subtitle.trim() !== "";
  const showHeader = hasTitle || hasSubtitle;

  return (
    <div className={`fl-root ${className}`}>
      {showHeader && (
        <div className="fl-header">
          {hasTitle && <span className="fl-eyebrow">{title}</span>}
          {hasSubtitle && <h3 className="fl-heading">{subtitle}</h3>}
        </div>
      )}

      <nav className="fl-list" ref={scrollRef} aria-label="Lista de beneficios">
        {features.map((feature, index) => {
          const isActive = activeId === feature.id;
          const isHovered = hoveredId === feature.id && !isActive;

          return (
            <button
              key={feature.id}
              type="button"
              className={`fl-item ${isActive ? "fl-item--active" : ""} ${isHovered ? "fl-item--hover" : ""}`}
              onClick={() => onSelect(feature.id)}
              onMouseEnter={() => setHoveredId(feature.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-pressed={isActive}
              aria-label={feature.text}
            >
              {/* Accent bar indicator (desktop) */}
              <span className="fl-indicator" aria-hidden="true" />

              {/* Número sutil */}
              <span className="fl-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Hex icon */}
              <span className="fl-icon">
                <img
                  src={feature.hexIcon}
                  alt=""
                  className="fl-icon-img"
                  draggable={false}
                />
              </span>

              {/* Feature text */}
              <span className="fl-text">{feature.text}</span>

              {/* Active chevron */}
              <span className="fl-chevron" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
