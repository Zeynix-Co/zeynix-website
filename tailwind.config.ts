import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                afacad: ["var(--font-afacad)", "sans-serif"],
                sans: ["var(--font-afacad)", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config; 