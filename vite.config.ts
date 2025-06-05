import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 또는 '0.0.0.0'
    port: 5173, // 생략 가능하지만 명시하면 명확해요
  },
}); 