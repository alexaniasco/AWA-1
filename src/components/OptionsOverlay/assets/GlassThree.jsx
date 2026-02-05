import * as React from "react";

const GlassThree = (props) => (
  <svg
    viewBox="0 0 784 383"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    style={{ width: "100%", height: "auto" }}
  >
    <foreignObject x={-49.5771} y={-50} width={100.577} height={472.389}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          backdropFilter: "blur(25px)",
          clipPath: "url(#bgblur_0_412_383_clip_path)",
          height: "100%",
          width: "100%",
        }}
      />
    </foreignObject>
    <g filter="url(#filter0_ii_412_383)" data-figma-bg-blur-radius={50}>
      <path
        d="M780 0H4.43098C0.899814 0 -0.899192 4.24161 1.55523 6.7803L122.639 132.021C125.085 134.552 128.685 135.618 132.159 135.054C147.732 132.527 193.704 127.723 241.656 148.253C289.615 168.786 334.965 211.929 350.725 273.175C361.501 315.051 354.13 360.639 350.707 377.37C350.094 380.365 352.87 383.034 355.824 382.251L781.024 269.588C782.779 269.124 784 267.536 784 265.722V4C784 1.79086 782.209 0 780 0Z"
        fill="url(#paint0_linear_412_383)"
        fillOpacity={0.5}
      />
    </g>
    <defs>
      <filter
        id="filter0_ii_412_383"
        x={-49.5771}
        y={-50}
        width={883.577}
        height={482.389}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={2} dy={2} />
        <feGaussianBlur stdDeviation={4} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.820898 0 0 0 0 0.820898 0 0 0 0 0.820898 0 0 0 0.11 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_412_383"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={-5} dy={-5} />
        <feGaussianBlur stdDeviation={4} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.333333 0 0 0 0 0.313889 0 0 0 0 0.319492 0 0 0 0.11 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_innerShadow_412_383"
          result="effect2_innerShadow_412_383"
        />
      </filter>
      <clipPath
        id="bgblur_0_412_383_clip_path"
        transform="translate(49.5771 50)"
      >
        <path d="M780 0H4.43098C0.899814 0 -0.899192 4.24161 1.55523 6.7803L122.639 132.021C125.085 134.552 128.685 135.618 132.159 135.054C147.732 132.527 193.704 127.723 241.656 148.253C289.615 168.786 334.965 211.929 350.725 273.175C361.501 315.051 354.13 360.639 350.707 377.37C350.094 380.365 352.87 383.034 355.824 382.251L781.024 269.588C782.779 269.124 784 267.536 784 265.722V4C784 1.79086 782.209 0 780 0Z" />
      </clipPath>
      <linearGradient
        id="paint0_linear_412_383"
        x1={238.654}
        y1={-25.762}
        x2={365.391}
        y2={386.107}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#07250B" stopOpacity={0.5} />
        <stop offset={0.528368} stopColor="#11581A" />
        <stop offset={0.975} stopColor="#07250B" stopOpacity={0.5} />
      </linearGradient>
    </defs>
  </svg>
);

export default GlassThree;
