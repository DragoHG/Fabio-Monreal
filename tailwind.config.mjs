import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts,md,mdx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        hub: {
          bg: "#121414",
          muted: "#a8adaa",
          accent: "#e9c349",
          border: "rgba(255,255,255,0.1)"
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"]
      },
      typography: {
        invert: {
          css: {
            "--tw-prose-body": "#a8adaa",
            "--tw-prose-headings": "#e2e2e2",
            "--tw-prose-links": "#e9c349",
            "--tw-prose-bold": "#e2e2e2",
            "--tw-prose-quotes": "#a8adaa",
            "--tw-prose-code": "#e2e2e2",
            "--tw-prose-bullets": "#7d7d7c",
            "--tw-prose-hr": "rgba(255,255,255,0.1)"
          }
        }
      }
    }
  },
  plugins: [typography]
};
