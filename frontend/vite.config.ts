import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? process.env.VITE_BASE_PATH : '/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
  },
  base: basePath,
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          virtuoso: ['react-virtuoso'],
          protobuf: ['@protobuf-ts/grpcweb-transport', '@protobuf-ts/runtime'],
          vendor: ['lodash-es', 'react-tabs', 'yup', 'formik'],
          sweetalert: ['sweetalert2', 'sweetalert2-react-content'],
        },
      },
    },
  },
});
