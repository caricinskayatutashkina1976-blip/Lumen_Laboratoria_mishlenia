import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages: https://<user>.github.io/Lumen_Laboratoria_mishlenia/
export default defineConfig({
  base: '/Lumen_Laboratoria_mishlenia/',
  plugins: [react(), tailwindcss()],
});
