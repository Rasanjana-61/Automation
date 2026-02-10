/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c1218",
        mist: "#f3f5f7",
        ocean: "#0f2a3d",
        sun: "#f6a04d",
        coral: "#ff6b5a"
      },
      fontFamily: {
        display: ["\"Playfair Display\"", "serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 25px 60px rgba(15, 42, 61, 0.2)"
      }
    }
  },
  plugins: []
};
