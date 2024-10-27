import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";


export default defineConfig({
  build: { minify: false },
  assetsInclude: ['**/*.m8s'],
  plugins: [
    preact(),
    wasm(),
    topLevelAwait()
  ]
});
