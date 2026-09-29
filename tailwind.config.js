/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        ink: {
          50: "#f7fafc",
          100: "#edf2f7",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        aurora: {
          50: "#eefbf8",
          100: "#d6f5ee",
          200: "#a7e9dc",
          300: "#6ed6c7",
          400: "#37c2b1",
          500: "#17a899",
          600: "#12857b",
          700: "#13685f",
          800: "#14534d",
          900: "#113f3c",
        },
        ember: {
          50: "#fff5eb",
          100: "#ffe7cc",
          200: "#ffd197",
          300: "#ffb15b",
          400: "#ff9234",
          500: "#f97116",
          600: "#d95110",
          700: "#b33b12",
          800: "#8f3115",
          900: "#752b14",
        },
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.10)",
        glow: "0 0 0 1px rgba(23, 168, 153, 0.12), 0 20px 45px rgba(23, 168, 153, 0.16)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "brand-radial":
          "radial-gradient(circle at top left, rgba(23,168,153,0.28), transparent 36%), radial-gradient(circle at top right, rgba(249,113,22,0.24), transparent 32%), linear-gradient(180deg, #0f172a 0%, #111827 100%)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        taskora: {
          primary: "#17a899",
          secondary: "#f97116",
          accent: "#6ed6c7",
          neutral: "#0f172a",
          "base-100": "#f8fafc",
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      "dark",
    ],
  },
};
