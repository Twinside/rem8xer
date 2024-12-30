/// <reference types="vitest" />
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  test: {
    watch: false,
    reporters: ["default", { async onWatcherRerun() {
        setup();
    }}]
  },
  assetsInclude: ['**/*.m8s'],
  plugins: [
    wasm()
  ]
})