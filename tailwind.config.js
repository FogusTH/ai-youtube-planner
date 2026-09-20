/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1B2A4A",
        navydeep: "#131F38",
        paper: "#EEF1F6",
        card: "#FFFFFF",
        ink: "#223047",
        inkmuted: "#5B6B85",
        amber: "#E8A33D",
        line: "#DDE3ED",
        status: {
          idea: "#8B8FA8",
          script: "#5B7FDB",
          shooting: "#E8A33D",
          editing: "#8B5CF6",
          posted: "#2FA36B",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
