import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

const noAttr = () => {
  return {
    name: "no-attribute",
    transformIndexHtml(html : any) {
      return html.replace("crossorigin", "");
    }
  }
}

export default defineConfig({
  base: './',
  build: {
    minify: false,
    target: "modules"
  },
  assetsInclude: ['**/*.m8s'],
  plugins: [
    preact(),
    wasm(),
    topLevelAwait(),
    noAttr()
  ]
});
