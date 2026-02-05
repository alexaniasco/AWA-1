import * as React from "react";
const GlassOne = (props) => (
  <svg
    width={610}
    height={760}
    viewBox="0 0 610 760"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" // Mantiene la proporción
    {...props}
    style={{ width: "100%", height: "100%" }}
  >
    <foreignObject x={-50} y={-50} width={709.229} height={862}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          backdropFilter: "blur(25px)",
          clipPath: "url(#bgblur_0_419_15_clip_path)",
          height: "100%",
          width: "100%",
        }}
      />
    </foreignObject>
    <g filter="url(#filter0_iiii_419_15)" data-figma-bg-blur-radius={50}>
      <path
        d="M429.201 0H0V762H363.093L548.975 523.609C552.077 519.63 551.764 513.947 548.45 510.144C538.792 499.062 519.566 474.687 507.329 443.835C483.79 384.491 496.048 325.147 526.36 273.781C549.706 234.222 592.144 211.338 606.832 204.313C609.332 203.117 610.038 199.803 608.179 197.748L429.201 0Z"
        fill="url(#paint0_linear_419_15)"
        fillOpacity={0.5}
      />
    </g>
    <defs>
      <filter
        id="filter0_iiii_419_15"
        x={-50}
        y={-50}
        width={709.229}
        height={862}
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
          result="effect1_innerShadow_419_15"
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
          in2="effect1_innerShadow_419_15"
          result="effect2_innerShadow_419_15"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={4} dy={2} />
        <feGaussianBlur stdDeviation={2.5} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="effect2_innerShadow_419_15"
          result="effect3_innerShadow_419_15"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={-4} dy={-1} />
        <feGaussianBlur stdDeviation={2.5} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="effect3_innerShadow_419_15"
          result="effect4_innerShadow_419_15"
        />
      </filter>
      <clipPath id="bgblur_0_419_15_clip_path" transform="translate(50 50)">
        <path d="M429.201 0H0V762H363.093L548.975 523.609C552.077 519.63 551.764 513.947 548.45 510.144C538.792 499.062 519.566 474.687 507.329 443.835C483.79 384.491 496.048 325.147 526.36 273.781C549.706 234.222 592.144 211.338 606.832 204.313C609.332 203.117 610.038 199.803 608.179 197.748L429.201 0Z" />
      </clipPath>
      <linearGradient
        id="paint0_linear_419_15"
        x1={327.786}
        y1={60.8403}
        x2={71.4724}
        y2={669.528}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#290611" stopOpacity={0.5} />
        <stop offset={0.385} stopColor="#8F163A" stopOpacity={0.9} />
        <stop offset={1} stopColor="#290611" stopOpacity={0.5} />
      </linearGradient>
    </defs>
  </svg>
);
export default GlassOne;
