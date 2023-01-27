/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
    './index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Roboto, verdana'
      },
      colors: {
        background: '#0f0f0f',
        DefaultRedEtec: "#B20000",
        DefaultRedBoldEtec: "#7E0000",
        DefaultBlueEtec: "#005C6D",
        DefaultBlueHoverEtec: "#004854",
        SecondaryBlueEtec: "#00C1CF",
        SecondaryBlueHoverEtec: "#00D8E8",
        EtecGrayText: "#666666",
        EtecLightGray: "#DADADA",
        EtecGrayHover: "#E6E6E6",

      },

    },
  },
  plugins: [],
}