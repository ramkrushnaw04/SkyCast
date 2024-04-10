/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: [
    "./html_pages/*.{html,ejs}",
    "./scripts/*.js"
    ],
  theme: {
    extend: {
      colors: {
        'transparentBlue': '#4d96e49c',
        'transparentGrey': '#00000038'
      },
      screens: {
        "mobile": {"min": "0px", "max": "600px"},
        "tablet": {"min": "601px", "max": "915px"},
        "btablet" : {"min": "916px", "max": "1320px"},
        "desktop": "1321px"
      }

    }
    
  },
  plugins: [],
}

