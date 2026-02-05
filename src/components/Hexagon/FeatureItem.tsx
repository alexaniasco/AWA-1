// components/Features/FeatureItem.tsx
import './features.css'


interface FeatureItemProps {
  iconSrc: string
  text: string
  position?: 'left' | 'right'
  isFirst?: boolean
  className?: string
}

export default function FeatureItem({
  iconSrc,
  text,
  position = 'left',
  isFirst = false,
  className = ''
}: FeatureItemProps) {
  return (
    <div
      className={`feature-item feature-item--${position} ${
        isFirst ? 'feature-item--first' : ''
      } ${className}`}
    >
      <div className="feature-item__hexagon-wrapper">
        <img
          src={iconSrc || '/A7.png'}
          alt=""
          className="feature-item__hexagon"
        />
      </div>

      <p className="feature-item__text">
        {text || 'Texto no disponible'}
      </p>
    </div>
  )
}
