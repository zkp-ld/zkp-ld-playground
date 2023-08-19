import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.argv': process.argv, // TODO: temporary solution for json-diff & vite combination (see: https://github.com/andreyvit/json-diff/issues/123)
    'process.env': process.env, // TODO: temporary solution for json-diff & vite combination (see: https://github.com/andreyvit/json-diff/issues/123)
  }
});
