import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The core matte background color
        brand: {
          matte: "#121214",      // Base background
          surface: "#18181b",    // Slightly lighter for contrast if needed
          cyan: "#22d3ee",       // Your primary glow color
          purple: "#9333ea",     // Your secondary glow color
        },
      },
      boxShadow: {
  // Mobile-Optimized: Reduced blur (16px -> 8px) to save GPU cycles
  'neu-out': '4px 4px 8px rgba(0, 0, 0, 0.4), -2px -2px 8px rgba(255, 255, 255, 0.02)',
  'neu-in': 'inset 3px 3px 6px rgba(0, 0, 0, 0.4), inset -2px -2px 6px rgba(255, 255, 255, 0.01)',
  'glow-cyan': '0 0 10px rgba(34, 211, 238, 0.3)', // Lower spread
},
      // Neumorphism looks better with very specific rounded corners
      borderRadius: {
        'neu': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;