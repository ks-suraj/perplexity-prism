// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",  // blue
        secondary: "#9333ea", // purple
        bgGray: "#f9fafb",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
        floating: "0 6px 20px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
