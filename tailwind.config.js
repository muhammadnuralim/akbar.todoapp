/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./todo/**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['"Open Sans"', '"Noto Sans"', '"Helvetica Neue"', 'sans-serif']
    },
    extend: {
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif']
      },
      backgroundImage: {
        'login': "url('../img/bg-login.png')",
        'register': "url('../img/bg-register.png')",
        'navbar': "url('../img/bg-navbar.png')"
      },
      dropShadow: {
        'right': '5px 0px 10px rgba(0, 0, 0, 0.3)'
      },
      borderRadius: {
        '4xl': '3rem'
      }
    },
  },
  plugins: [],
}