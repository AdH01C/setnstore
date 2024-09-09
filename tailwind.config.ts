import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },

    colors: {
      primary: "#61D06C",
      secondary: "#2E6747",
      background: "#19262D",
      white: "#FFFFFF",
      black: "#000000",
      'gray-100': '#F7FAFC',
      'gray-200': '#EDF2F7',
      'gray-300': '#E2E8F0',
      'gray-400': '#CBD5E0',
      'gray-500': '#A0AEC0',
      'gray-600': '#718096',
      'gray-700': '#4A5568',
      'gray-800': '#2D3748',
      'gray-900': '#1A202C',
      'blue-100': '#EBF8FF',
      'blue-200': '#BEE3F8',
      'blue-300': '#90CDF4',
      'blue-400': '#63B3ED',
      'blue-500': '#4299E1',
      'blue-600': '#3182CE',
      'blue-700': '#2B6CB0',
      'blue-800': '#2C5282',
      'blue-900': '#2A4365',
    },
  },
  plugins: [],
};
export default config;
