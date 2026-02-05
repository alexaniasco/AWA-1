import * as React from "react";

const GlassTwo = (props) => (
  <svg
    viewBox="0 0 833 316"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    style={{ width: "100%", height: "auto" }}
  >
    <foreignObject x={-49.8945} y={-49.8438} width={932.395} height={415.344}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          backdropFilter: "blur(25px)",
          clipPath: "url(#bgblur_0_412_387_clip_path)",
          height: "100%",
          width: "100%",
        }}
      />
    </foreignObject>
    <g filter="url(#filter0_ii_412_387)" data-figma-bg-blur-radius={50}>
      <path
        d="M377.335 116.014L827.504 0.284359C830.035 -0.366306 832.5 1.54512 832.5 4.15839V311.5C832.5 313.709 830.709 315.5 828.5 315.5H4.11299C0.796187 315.5 -1.0796 311.695 0.940001 309.064L102.738 176.447C104.013 174.785 106.35 174.392 108.123 175.506C187.289 225.255 306.642 218.339 371.331 120.351C372.733 118.229 374.871 116.647 377.335 116.014Z"
        fill="url(#paint0_linear_412_387)"
        fillOpacity={0.49}
      />
    </g>
    <defs>
      <filter
        id="filter0_ii_412_387"
        x={-49.8945}
        y={-49.8438}
        width={932.395}
        height={415.344}
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
          result="effect1_innerShadow_412_387"
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
          in2="effect1_innerShadow_412_387"
          result="effect2_innerShadow_412_387"
        />
      </filter>
      <clipPath
        id="bgblur_0_412_387_clip_path"
        transform="translate(49.8945 49.8438)"
      >
        <path d="M377.335 116.014L827.504 0.284359C830.035 -0.366306 832.5 1.54512 832.5 4.15839V311.5C832.5 313.709 830.709 315.5 828.5 315.5H4.11299C0.796187 315.5 -1.0796 311.695 0.940001 309.064L102.738 176.447C104.013 174.785 106.35 174.392 108.123 175.506C187.289 225.255 306.642 218.339 371.331 120.351C372.733 118.229 374.871 116.647 377.335 116.014Z" />
      </clipPath>
      <linearGradient
        id="paint0_linear_412_387"
        x1={779.5}
        y1={-82.5}
        x2={217.5}
        y2={458.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#030543" stopOpacity={0.5} />
        <stop offset={0.45} stopColor="#050976" />
        <stop offset={1} stopColor="#030543" stopOpacity={0.5} />
      </linearGradient>
    </defs>
  </svg>
);

export default GlassTwo;
