/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff'
        }
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [forms()],
}
