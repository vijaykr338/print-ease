/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "move-border": "move-dots 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        "move-dots": {
          "0%": { clipPath: "inset(0 0 90% 0)" },
          "25%": { clipPath: "inset(0 90% 0 0)" },
          "50%": { clipPath: "inset(90% 0 0 0)" },
          "75%": { clipPath: "inset(0 0 0 90%)" },
          "100%": { clipPath: "inset(0 0 90% 0)" },
        },
      },
    },
  },
  plugins: [],
};
