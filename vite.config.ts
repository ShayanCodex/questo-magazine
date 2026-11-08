import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { getIncludedRoutes } from './scripts/lib/content.mjs';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  ssgOptions: {
    formatting: 'none',
    includedRoutes() {
      return getIncludedRoutes();
    },
  },
});

