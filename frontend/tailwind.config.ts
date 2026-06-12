import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        borderLight: "var(--border-light)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" }
      },
      borderRadius: {
        none: "0px",
        sm: "12px",
        DEFAULT: "18px",
        md: "18px",
        lg: "24px",
        xl: "28px",
        "2xl": "28px",
        "3xl": "32px",
        full: "9999px"
      },
      boxShadow: {
        none: "none",
        soft: "0 4px 20px rgba(0, 0, 0, 0.2)",
        glass: "0 0 0 1px rgba(255, 255, 255, 0.04), 0 10px 30px rgba(0, 0, 0, 0.4)"
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
