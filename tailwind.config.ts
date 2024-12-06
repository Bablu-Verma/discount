import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
          light: "#ffffff",
          primary: "#db4444",
          secondary: "#0f1336",
          dark: "#212121",
          grayLight: "#f2f2f2",
      },
      fontFamily: {
        roboto: ['"Roboto"', "sans-serif"],
      },
      screens: {
        mobile: "320px", 
      },
    },
  },
  plugins: [],
} satisfies Config;
