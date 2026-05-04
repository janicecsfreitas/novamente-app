import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f4faff",
        surface: "#f4faff",
        "surface-dim": "#cfdce4",
        "surface-bright": "#f4faff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#e9f6fd",
        "surface-container": "#e3f0f8",
        "surface-container-high": "#ddeaf2",
        "surface-container-highest": "#d7e4ec",
        "on-surface": "#111d23",
        "on-surface-variant": "#3f4945",
        "inverse-surface": "#263238",
        "inverse-on-surface": "#e6f3fb",
        outline: "#707975",
        "outline-variant": "#bfc9c4",
        "surface-tint": "#1B5B0F",
        primary: "#1B5B0F",
        "on-primary": "#ffffff",
        "primary-container": "#1B5B0F",
        "on-primary-container": "#ffffff",
        "inverse-primary": "#94d3c1",
        secondary: "#9f4200",
        "on-secondary": "#ffffff",
        "secondary-container": "#fd6c00",
        "on-secondary-container": "#562000",
        tertiary: "#4e2013",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#693527",
        "on-tertiary-container": "#e89f8c",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "primary-fixed": "#afefdd",
        "primary-fixed-dim": "#94d3c1",
        "on-primary-fixed": "#00201a",
        "on-primary-fixed-variant": "#065043",
        "secondary-fixed": "#ffdbcb",
        "secondary-fixed-dim": "#ffb692",
        "on-secondary-fixed": "#341100",
        "on-secondary-fixed-variant": "#7a3000",
        "tertiary-fixed": "#ffdbd1",
        "tertiary-fixed-dim": "#ffb5a1",
        "on-tertiary-fixed": "#370e04",
        "on-tertiary-fixed-variant": "#6d382a",
        "on-background": "#111d23",
        "surface-variant": "#d7e4ec"
      },
      spacing: {
        xs: "4px",
        base: "8px",
        sm: "12px",
        gutter: "16px",
        md: "24px",
        margin: "24px",
        lg: "40px",
        xl: "64px"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      fontFamily: {
        h1: ["var(--font-lexend)"],
        h2: ["var(--font-lexend)"],
        h3: ["var(--font-lexend)"],
        display: ["var(--font-epilogue)"],
        "body-md": ["var(--font-inter)"],
        "body-lg": ["var(--font-inter)"],
        "label-caps": ["var(--font-lexend)"],
        "label-md": ["var(--font-manrope)"],
        caption: ["var(--font-manrope)"],
        "data-tabular": ["var(--font-inter)"]
      },
      fontSize: {
        h1: ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["32px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        h3: ["24px", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "700" }],
        "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.01em", fontWeight: "600" }],
        caption: ["12px", { lineHeight: "1.2", fontWeight: "500" }],
        "data-tabular": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }]
      }
    }
  },
  plugins: []
};

export default config;
