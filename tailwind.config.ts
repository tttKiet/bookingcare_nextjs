import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        home: "url('/images/bg-home-4.avif')",
        "home-2": "url('/images/bg-home-2.jpg')",
        body: "url('/images/bg-1.jpg')",
        "linear-blue-pink": "linear-gradient(66deg, #e6fbfe 22%, #edddfb 100%)",
      },

      backgroundColor: {
        dard: "#001529",
        "edit-hover": "#ff9f00b0",
      },

      container: {
        screens: {
          sm: "600px",
          md: "728px",
          lg: "984px",
          xl: "1140px",
          "2xl": "1396px",
        },
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      margin: {
        "left-nav-admin": "0 0 0 var(--nav-width-admin)",
      },
      textColor: {
        edit: "#8b6f12",
      },
    },
  },
  // corePlugins: {
  //   preflight: false,
  // },
  darkMode: "class",
 plugins: [nextui()],
};
export default config;
