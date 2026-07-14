export default {
  plugins: {
    tailwindcss: {},
    // Eski Safari (iOS 9) için modern CSS'i dönüştürür: rgb(r g b / a) -> rgba(...),
    // vendor prefix'ler vb. Hedefler package.json'daki browserslist'ten okunur.
    'postcss-preset-env': {
      features: {
        'color-functional-notation': { preserve: false },
      },
    },
  },
}

